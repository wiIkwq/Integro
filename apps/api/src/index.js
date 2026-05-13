import { Hono } from "hono";
import { cors } from "hono/cors";
import {
  clearOauthStateCookie,
  clearSession,
  createSession,
  currentUser,
  isAdminEmail,
  publicUser,
  randomToken,
  readOauthStateCookie,
  requireAdmin,
  requireUser,
  safeReturnTo,
  setOauthStateCookie
} from "./auth.js";
import { ok, fail } from "./response.js";
import { normalizeCode, optionalDate, requireInt, requireString } from "./validation.js";
import { BridgeRoom } from "./bridge-room.js";

const app = new Hono();

app.use("*", async (c, next) => {
  const origin = c.req.header("origin");
  const allowed = [c.env.WEB_ORIGIN, c.env.API_ORIGIN].filter(Boolean);
  return cors({
    origin: origin && allowed.includes(origin) ? origin : allowed[0] || "*",
    credentials: true,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"]
  })(c, next);
});

app.get("/health", (c) => c.json(ok({ service: "integro-api", time: new Date().toISOString() })));

app.get("/me", async (c) => {
  const user = await currentUser(c);
  return c.json(ok({ user: publicUser(user) }));
});

app.get("/auth/google/start", async (c) => {
  if (!c.env.GOOGLE_CLIENT_ID || !c.env.GOOGLE_CLIENT_SECRET) {
    const returnTo = new URL(safeReturnTo(c.env, c.req.query("returnTo")));
    returnTo.searchParams.set("error", "oauth_not_configured");
    return c.redirect(returnTo.toString());
  }

  const state = randomToken();
  const returnTo = safeReturnTo(c.env, c.req.query("returnTo"));
  setOauthStateCookie(c, state, returnTo);

  const redirectUri = `${c.env.API_ORIGIN}/auth/google/callback`;
  const params = new URLSearchParams({
    client_id: c.env.GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account"
  });

  return c.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
});

app.get("/auth/google/callback", async (c) => {
  const expected = readOauthStateCookie(c);
  const state = c.req.query("state");
  const code = c.req.query("code");

  if (!expected || expected.state !== state || !code) {
    return fail("Invalid OAuth state", "invalid_oauth_state", 400);
  }

  clearOauthStateCookie(c);
  const redirectUri = `${c.env.API_ORIGIN}/auth/google/callback`;
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: c.env.GOOGLE_CLIENT_ID,
      client_secret: c.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
      code
    })
  });

  if (!tokenResponse.ok) {
    return fail("Google token exchange failed", "oauth_exchange_failed", 502);
  }

  const tokenPayload = await tokenResponse.json();
  const profileResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: { Authorization: `Bearer ${tokenPayload.access_token}` }
  });

  if (!profileResponse.ok) {
    return fail("Google profile fetch failed", "oauth_profile_failed", 502);
  }

  const profile = await profileResponse.json();
  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  const role = isAdminEmail(c.env, profile.email) ? "admin" : "user";

  await c.env.DB.prepare(
    `INSERT INTO users (id, google_sub, email, name, avatar_url, role, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(google_sub) DO UPDATE SET
       email = excluded.email,
       name = excluded.name,
       avatar_url = excluded.avatar_url,
       role = excluded.role,
       updated_at = excluded.updated_at`
  ).bind(id, profile.sub, profile.email, profile.name || profile.email, profile.picture || null, role, now, now).run();

  const user = await c.env.DB.prepare("SELECT id FROM users WHERE google_sub = ?").bind(profile.sub).first();
  await createSession(c, user.id);
  return c.redirect(expected.returnTo || c.env.WEB_ORIGIN || "/");
});

app.post("/auth/logout", async (c) => {
  await clearSession(c);
  return c.json(ok());
});

app.get("/actions", async (c) => {
  const rows = await c.env.DB.prepare(
    `SELECT id, title, description, price, cooldown_seconds, is_enabled
     FROM minecraft_actions
     WHERE is_enabled = 1
     ORDER BY created_at DESC`
  ).all();
  return c.json(ok({ actions: mapActions(rows.results || []) }));
});

app.post("/actions/:id/purchase", requireUser, async (c) => {
  const user = c.get("user");
  const actionId = c.req.param("id");
  const action = await c.env.DB.prepare(
    "SELECT * FROM minecraft_actions WHERE id = ? AND is_enabled = 1"
  ).bind(actionId).first();

  if (!action) return fail("Action is not available", "action_unavailable", 404);

  if (action.cooldown_seconds > 0) {
    const cooldown = await c.env.DB.prepare(
      `SELECT id FROM action_purchases
       WHERE action_id = ? AND created_at > datetime('now', ?)
       LIMIT 1`
    ).bind(actionId, `-${action.cooldown_seconds} seconds`).first();
    if (cooldown) return fail("Action is on cooldown", "cooldown", 429);
  }

  const purchaseId = crypto.randomUUID();
  const txId = crypto.randomUUID();
  const now = new Date().toISOString();
  const command = renderCommand(action.command, user);

  const batch = await c.env.DB.batch([
    c.env.DB.prepare(
      "UPDATE users SET balance = balance - ?, updated_at = ? WHERE id = ? AND balance >= ?"
    ).bind(action.price, now, user.id, action.price),
    c.env.DB.prepare(
      `INSERT INTO action_purchases (id, user_id, action_id, amount, status, command_snapshot, created_at)
       SELECT ?, ?, ?, ?, 'queued', ?, ? WHERE changes() = 1`
    ).bind(purchaseId, user.id, actionId, action.price, command, now),
    c.env.DB.prepare(
      `INSERT INTO balance_transactions (id, user_id, type, amount, reference_id, note, created_at)
       SELECT ?, ?, 'action_purchase', ?, ?, ?, ? WHERE changes() = 1`
    ).bind(txId, user.id, -action.price, purchaseId, action.title, now)
  ]);

  if ((batch[0]?.meta?.changes || 0) !== 1) {
    return fail("Not enough coins", "insufficient_balance", 409);
  }

  await bridgeFetch(c.env, "/dispatch", {
    method: "POST",
    body: JSON.stringify({ purchaseId })
  });

  return c.json(ok({ purchaseId }));
});

app.get("/me/transactions", requireUser, async (c) => {
  const user = c.get("user");
  const rows = await c.env.DB.prepare(
    `SELECT id, type, amount, reference_id, note, created_at
     FROM balance_transactions
     WHERE user_id = ?
     ORDER BY created_at DESC
     LIMIT 50`
  ).bind(user.id).all();
  return c.json(ok({ transactions: mapTransactions(rows.results || []) }));
});

app.get("/me/purchases", requireUser, async (c) => {
  const user = c.get("user");
  const rows = await c.env.DB.prepare(
    `SELECT action_purchases.id,
            action_purchases.amount,
            action_purchases.status,
            action_purchases.command_snapshot,
            action_purchases.created_at,
            action_purchases.completed_at,
            action_purchases.error_message,
            minecraft_actions.title
     FROM action_purchases
     JOIN minecraft_actions ON minecraft_actions.id = action_purchases.action_id
     WHERE action_purchases.user_id = ?
     ORDER BY action_purchases.created_at DESC
     LIMIT 50`
  ).bind(user.id).all();
  return c.json(ok({ purchases: mapPurchases(rows.results || []) }));
});

app.post("/vouchers/redeem", requireUser, async (c) => {
  const user = c.get("user");
  const body = await c.req.json().catch(() => ({}));
  const code = normalizeCode(body.code);
  if (!code) return fail("Voucher code is required", "invalid_code", 400);

  const voucher = await c.env.DB.prepare("SELECT * FROM vouchers WHERE code = ?").bind(code).first();
  if (!voucher || !voucher.is_active) return fail("Voucher is not active", "voucher_inactive", 404);
  if (voucher.expires_at && new Date(voucher.expires_at) < new Date()) {
    return fail("Voucher has expired", "voucher_expired", 410);
  }

  const redemptionId = crypto.randomUUID();
  const txId = crypto.randomUUID();
  const now = new Date().toISOString();

  const batch = await c.env.DB.batch([
    c.env.DB.prepare(
      `UPDATE vouchers
       SET redeemed_count = redeemed_count + 1, updated_at = ?
       WHERE id = ?
         AND is_active = 1
         AND redeemed_count < max_redemptions
         AND (expires_at IS NULL OR expires_at > ?)
         AND NOT EXISTS (
           SELECT 1 FROM voucher_redemptions
           WHERE voucher_id = ? AND user_id = ?
         )`
    ).bind(now, voucher.id, now, voucher.id, user.id),
    c.env.DB.prepare(
      `INSERT INTO voucher_redemptions (id, voucher_id, user_id, coins_granted, created_at)
       SELECT ?, ?, ?, ?, ? WHERE changes() = 1`
    ).bind(redemptionId, voucher.id, user.id, voucher.coins, now),
    c.env.DB.prepare(
      "UPDATE users SET balance = balance + ?, updated_at = ? WHERE id = ? AND changes() = 1"
    ).bind(voucher.coins, now, user.id),
    c.env.DB.prepare(
      `INSERT INTO balance_transactions (id, user_id, type, amount, reference_id, note, created_at)
       SELECT ?, ?, 'voucher_redeem', ?, ?, ?, ? WHERE changes() = 1`
    ).bind(txId, user.id, voucher.coins, voucher.id, code, now)
  ]);

  if ((batch[0]?.meta?.changes || 0) !== 1) {
    return fail("Voucher was already used or limit reached", "voucher_unavailable", 409);
  }

  return c.json(ok({ coins: voucher.coins }));
});

app.get("/admin/overview", requireAdmin, async (c) => {
  const [actions, vouchers, users, bridge] = await Promise.all([
    c.env.DB.prepare("SELECT COUNT(*) AS count FROM minecraft_actions").first(),
    c.env.DB.prepare("SELECT COUNT(*) AS count FROM vouchers").first(),
    c.env.DB.prepare("SELECT COUNT(*) AS count FROM users").first(),
    bridgeFetch(c.env, "/status").then((response) => response.json()).catch(() => ({ connected: false, sockets: 0, queued: 0 }))
  ]);
  return c.json(ok({
    actionsCount: actions?.count || 0,
    vouchersCount: vouchers?.count || 0,
    usersCount: users?.count || 0,
    bridge
  }));
});

app.get("/admin/actions", requireAdmin, async (c) => {
  const rows = await c.env.DB.prepare(
    "SELECT * FROM minecraft_actions ORDER BY created_at DESC"
  ).all();
  return c.json(ok({ actions: mapActions(rows.results || [], true) }));
});

app.post("/admin/actions", requireAdmin, async (c) => {
  try {
    const body = await c.req.json();
    const now = new Date().toISOString();
    const row = {
      id: crypto.randomUUID(),
      title: requireString(body.title, "title", 2, 80),
      description: String(body.description || "").trim().slice(0, 500),
      price: requireInt(body.price, "price", 1),
      command: requireString(body.command, "command", 1, 400),
      cooldownSeconds: requireInt(body.cooldownSeconds || 0, "cooldownSeconds", 0, 86400)
    };
    await c.env.DB.prepare(
      `INSERT INTO minecraft_actions
       (id, title, description, price, command, cooldown_seconds, is_enabled, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)`
    ).bind(row.id, row.title, row.description, row.price, row.command, row.cooldownSeconds, now, now).run();
    return c.json(ok({ action: row }), 201);
  } catch (err) {
    return fail(err.message, "validation_error", 400);
  }
});

app.patch("/admin/actions/:id", requireAdmin, async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const existing = await c.env.DB.prepare("SELECT * FROM minecraft_actions WHERE id = ?").bind(c.req.param("id")).first();
  if (!existing) return fail("Action not found", "not_found", 404);

  const next = {
    title: body.title === undefined ? existing.title : requireString(body.title, "title", 2, 80),
    description: body.description === undefined ? existing.description : String(body.description || "").trim().slice(0, 500),
    price: body.price === undefined ? existing.price : requireInt(body.price, "price", 1),
    command: body.command === undefined ? existing.command : requireString(body.command, "command", 1, 400),
    cooldownSeconds: body.cooldownSeconds === undefined ? existing.cooldown_seconds : requireInt(body.cooldownSeconds, "cooldownSeconds", 0, 86400),
    isEnabled: body.isEnabled === undefined ? existing.is_enabled : body.isEnabled ? 1 : 0
  };

  await c.env.DB.prepare(
    `UPDATE minecraft_actions
     SET title = ?, description = ?, price = ?, command = ?, cooldown_seconds = ?, is_enabled = ?, updated_at = ?
     WHERE id = ?`
  ).bind(next.title, next.description, next.price, next.command, next.cooldownSeconds, next.isEnabled, new Date().toISOString(), existing.id).run();
  return c.json(ok());
});

app.delete("/admin/actions/:id", requireAdmin, async (c) => {
  await c.env.DB.prepare(
    "UPDATE minecraft_actions SET is_enabled = 0, updated_at = ? WHERE id = ?"
  ).bind(new Date().toISOString(), c.req.param("id")).run();
  return c.json(ok());
});

app.get("/admin/vouchers", requireAdmin, async (c) => {
  const rows = await c.env.DB.prepare("SELECT * FROM vouchers ORDER BY created_at DESC LIMIT 200").all();
  return c.json(ok({ vouchers: mapVouchers(rows.results || []) }));
});

app.post("/admin/vouchers", requireAdmin, async (c) => {
  const user = c.get("user");
  try {
    const body = await c.req.json();
    const now = new Date().toISOString();
    const row = {
      id: crypto.randomUUID(),
      code: normalizeCode(requireString(body.code, "code", 3, 64)),
      coins: requireInt(body.coins, "coins", 1),
      maxRedemptions: requireInt(body.maxRedemptions || 1, "maxRedemptions", 1, 100000),
      expiresAt: optionalDate(body.expiresAt)
    };
    await c.env.DB.prepare(
      `INSERT INTO vouchers
       (id, code, coins, max_redemptions, redeemed_count, expires_at, is_active, created_by, created_at, updated_at)
       VALUES (?, ?, ?, ?, 0, ?, 1, ?, ?, ?)`
    ).bind(row.id, row.code, row.coins, row.maxRedemptions, row.expiresAt, user.id, now, now).run();
    return c.json(ok({ voucher: row }), 201);
  } catch (err) {
    return fail(err.message, "validation_error", 400);
  }
});

app.patch("/admin/vouchers/:id", requireAdmin, async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const existing = await c.env.DB.prepare("SELECT * FROM vouchers WHERE id = ?").bind(c.req.param("id")).first();
  if (!existing) return fail("Voucher not found", "not_found", 404);
  await c.env.DB.prepare(
    `UPDATE vouchers
     SET is_active = ?, updated_at = ?
     WHERE id = ?`
  ).bind(body.isActive === undefined ? existing.is_active : body.isActive ? 1 : 0, new Date().toISOString(), existing.id).run();
  return c.json(ok());
});

app.get("/admin/users", requireAdmin, async (c) => {
  const rows = await c.env.DB.prepare(
    "SELECT id, email, name, avatar_url, role, balance, created_at FROM users ORDER BY created_at DESC LIMIT 200"
  ).all();
  return c.json(ok({ users: (rows.results || []).map((row) => ({
    id: row.id,
    email: row.email,
    name: row.name,
    avatarUrl: row.avatar_url,
    role: row.role,
    balance: row.balance,
    createdAt: row.created_at
  })) }));
});

app.get("/admin/purchases", requireAdmin, async (c) => {
  const rows = await c.env.DB.prepare(
    `SELECT action_purchases.*,
            minecraft_actions.title,
            users.email AS user_email,
            users.name AS user_name
     FROM action_purchases
     JOIN minecraft_actions ON minecraft_actions.id = action_purchases.action_id
     JOIN users ON users.id = action_purchases.user_id
     ORDER BY action_purchases.created_at DESC
     LIMIT 200`
  ).all();
  return c.json(ok({ purchases: mapPurchases(rows.results || []) }));
});

app.get("/bridge/connect", async (c) => {
  return bridgeFetch(c.env, "/connect", { headers: { Authorization: c.req.header("authorization") || "" } });
});

app.post("/bridge/flush", requireAdmin, async (c) => {
  const response = await bridgeFetch(c.env, "/flush", { method: "POST" });
  return c.json(ok(await response.json()));
});

function renderCommand(template, user) {
  return template
    .replaceAll("{user}", sanitizeCommandPart(user.name || user.email))
    .replaceAll("{email}", sanitizeCommandPart(user.email));
}

function sanitizeCommandPart(value) {
  return String(value || "")
    .replace(/[^\w.@-]/g, "_")
    .slice(0, 64);
}

function bridgeFetch(env, path, init = {}) {
  const id = env.BRIDGE_ROOM.idFromName("minecraft-primary");
  return env.BRIDGE_ROOM.get(id).fetch(`https://bridge${path}`, init);
}

function mapActions(rows, includeCommand = false) {
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    price: row.price,
    cooldownSeconds: row.cooldown_seconds,
    isEnabled: Boolean(row.is_enabled),
    ...(includeCommand ? { command: row.command } : {})
  }));
}

function mapVouchers(rows) {
  return rows.map((row) => ({
    id: row.id,
    code: row.code,
    coins: row.coins,
    maxRedemptions: row.max_redemptions,
    redeemedCount: row.redeemed_count,
    expiresAt: row.expires_at,
    isActive: Boolean(row.is_active),
    createdAt: row.created_at
  }));
}

function mapTransactions(rows) {
  return rows.map((row) => ({
    id: row.id,
    type: row.type,
    amount: row.amount,
    referenceId: row.reference_id,
    note: row.note,
    createdAt: row.created_at
  }));
}

function mapPurchases(rows) {
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    amount: row.amount,
    status: row.status,
    commandSnapshot: row.command_snapshot,
    createdAt: row.created_at,
    completedAt: row.completed_at,
    errorMessage: row.error_message,
    userEmail: row.user_email,
    userName: row.user_name
  }));
}

export { BridgeRoom };
export default app;
