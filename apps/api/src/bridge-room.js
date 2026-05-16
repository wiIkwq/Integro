import { sha256Hex } from "./auth.js";

export class BridgeRoom {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname.endsWith("/connect")) {
      return this.connect(request);
    }

    if (url.pathname.endsWith("/status")) {
      return Response.json(await this.status());
    }

    if (url.pathname.endsWith("/dispatch")) {
      const body = await request.json().catch(() => ({}));
      const sent = await this.sendPurchase(body.purchaseId);
      return Response.json({ sent });
    }

    if (url.pathname.endsWith("/dispatch-test")) {
      const body = await request.json().catch(() => ({}));
      const sent = await this.sendEvent({
        type: "execute",
        id: `test-${crypto.randomUUID()}`,
        title: String(body.title || "Integro test").slice(0, 120),
        command: body.commands?.[0]?.command || "",
        commands: parseCommandSnapshot(JSON.stringify(body.commands || [])),
        amount: 0,
        userName: String(body.userName || "Стример"),
        userEmail: "",
        createdAt: new Date().toISOString(),
        test: true
      });
      return Response.json({ sent });
    }

    if (url.pathname.endsWith("/flush")) {
      const sent = await this.flushQueued();
      return Response.json({ sent });
    }

    return new Response("Not found", { status: 404 });
  }

  async connect(request) {
    const auth = request.headers.get("authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
    const device = token ? await this.authorizeDevice(token) : null;
    if (!device && (!this.env.BRIDGE_TOKEN || auth !== `Bearer ${this.env.BRIDGE_TOKEN}`)) {
      return new Response("Unauthorized", { status: 401 });
    }

    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    this.state.acceptWebSocket(server);
    server.send(JSON.stringify({
      type: "hello",
      serverTime: new Date().toISOString(),
      streamerName: device?.user_name || null
    }));
    await this.flushQueued();
    return new Response(null, { status: 101, webSocket: client });
  }

  async authorizeDevice(token) {
    const tokenHash = await sha256Hex(token);
    const device = await this.env.DB.prepare(
      `SELECT bridge_devices.id,
              bridge_devices.user_id,
              bridge_devices.revoked_at,
              users.name AS user_name,
              users.role AS user_role
       FROM bridge_devices
       JOIN users ON users.id = bridge_devices.user_id
       WHERE bridge_devices.token_hash = ?`
    ).bind(tokenHash).first();
    if (!device || device.revoked_at) return null;
    if (!["admin", "developer", "streamer"].includes(device.user_role)) return null;
    await this.env.DB.prepare("UPDATE bridge_devices SET last_seen_at = ? WHERE id = ?")
      .bind(new Date().toISOString(), device.id)
      .run();
    return device;
  }

  async webSocketMessage(webSocket, message) {
    let payload;
    try {
      payload = JSON.parse(message);
    } catch {
      webSocket.send(JSON.stringify({ type: "error", message: "Invalid JSON" }));
      return;
    }

    if (payload.type === "ping") {
      webSocket.send(JSON.stringify({ type: "pong", serverTime: new Date().toISOString() }));
      return;
    }

    if (payload.type === "result") {
      await this.recordResult(payload);
      return;
    }

    webSocket.send(JSON.stringify({ type: "error", message: "Unknown message type" }));
  }

  async status() {
    const queued = await this.env.DB.prepare(
      "SELECT COUNT(*) AS count FROM action_purchases WHERE status = 'queued'"
    ).first();
    return {
      connected: this.state.getWebSockets().length > 0,
      sockets: this.state.getWebSockets().length,
      queued: queued?.count || 0
    };
  }

  async flushQueued() {
    const rows = await this.env.DB.prepare(
      `SELECT id FROM action_purchases
       WHERE status = 'queued'
       ORDER BY created_at ASC
       LIMIT 20`
    ).all();

    let sent = 0;
    for (const row of rows.results || []) {
      if (await this.sendPurchase(row.id)) sent += 1;
    }
    return sent;
  }

  async sendPurchase(purchaseId) {
    const sockets = this.state.getWebSockets();
    if (sockets.length === 0 || !purchaseId) return false;

    const row = await this.env.DB.prepare(
      `SELECT action_purchases.id,
              action_purchases.command_snapshot,
              action_purchases.amount,
              action_purchases.created_at,
              minecraft_actions.title,
              users.name AS user_name,
              users.email AS user_email
       FROM action_purchases
       JOIN minecraft_actions ON minecraft_actions.id = action_purchases.action_id
       JOIN users ON users.id = action_purchases.user_id
       WHERE action_purchases.id = ? AND action_purchases.status = 'queued'`
    ).bind(purchaseId).first();

    if (!row) return false;

    const commands = parseCommandSnapshot(row.command_snapshot);
    const event = {
      type: "execute",
      id: row.id,
      title: row.title,
      command: commands[0]?.command || row.command_snapshot,
      commands,
      amount: row.amount,
      userName: row.user_name,
      userEmail: row.user_email,
      createdAt: row.created_at
    };

    return this.sendEvent(event);
  }

  async sendEvent(event) {
    const sockets = this.state.getWebSockets();
    if (sockets.length === 0) return false;
    for (const socket of sockets) {
      socket.send(JSON.stringify(event));
    }
    return true;
  }

  async recordResult(payload) {
    const purchaseId = String(payload.id || "");
    const status = payload.status === "completed" ? "completed" : "failed";
    const message = String(payload.message || "").slice(0, 500);
    const now = new Date().toISOString();

    if (status === "completed") {
      await this.env.DB.prepare(
        `UPDATE action_purchases
         SET status = 'completed', completed_at = ?, error_message = NULL
         WHERE id = ? AND status = 'queued'`
      ).bind(now, purchaseId).run();
      return;
    }

    const refundId = crypto.randomUUID();
    await this.env.DB.batch([
      this.env.DB.prepare(
        `UPDATE action_purchases
         SET status = 'failed', completed_at = ?, error_message = ?
         WHERE id = ? AND status = 'queued'`
      ).bind(now, message, purchaseId),
      this.env.DB.prepare(
        `UPDATE users
         SET balance = balance + (
           SELECT amount FROM action_purchases WHERE id = ?
         ), updated_at = ?
         WHERE id = (
           SELECT user_id FROM action_purchases WHERE id = ?
         ) AND changes() = 1`
      ).bind(purchaseId, now, purchaseId),
      this.env.DB.prepare(
        `INSERT INTO balance_transactions (id, user_id, type, amount, reference_id, note, created_at)
         SELECT ?, user_id, 'action_refund', amount, id, ?, ?
         FROM action_purchases
         WHERE id = ? AND changes() = 1`
      ).bind(refundId, message || "Minecraft command failed", now, purchaseId)
    ]);
  }
}

function parseCommandSnapshot(snapshot) {
  try {
    const parsed = JSON.parse(snapshot || "[]");
    if (Array.isArray(parsed)) {
      const commands = parsed
        .map((step) => ({
          command: String(step?.command || "").trim(),
          delayMs: Math.max(0, Math.min(600000, Number(step?.delayMs) || 0))
        }))
        .filter((step) => step.command);
      if (commands.length > 0) return commands;
    }
  } catch {
    // Older rows contain one plain command string.
  }

  const command = String(snapshot || "").trim();
  return command ? [{ command, delayMs: 0 }] : [];
}
