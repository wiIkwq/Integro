import { Hono } from "hono";
import { cors } from "hono/cors";
import {
  clearOauthStateCookie,
  clearSession,
  createSession,
  currentUser,
  canConnectBridge,
  isAdminEmail,
  publicUser,
  randomToken,
  readOauthStateCookie,
  requireAdmin,
  requireDeveloper,
  requireUser,
  safeReturnTo,
  setOauthStateCookie,
  sha256Hex
} from "./auth.js";
import { ok, fail } from "./response.js";
import { normalizeCode, optionalDate, requireInt, requireString } from "./validation.js";
import { BridgeRoom } from "./bridge-room.js";

const app = new Hono();

app.use("*", async (c, next) => {
  const origin = c.req.header("origin");
  const allowed = [
    c.env.WEB_ORIGIN,
    c.env.API_ORIGIN,
    ...String(c.env.LEGACY_WEB_ORIGINS || "").split(",").map((item) => item.trim())
  ].filter(Boolean);
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

  const redirectUri = `${apiOrigin(c)}/auth/google/callback`;
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
  const redirectUri = `${apiOrigin(c)}/auth/google/callback`;
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
  const email = normalizeEmail(profile.email);
  const name = displayNameForEmail(email, profile.name || email);
  const existingByEmail = await c.env.DB.prepare("SELECT id, role FROM users WHERE email = ?").bind(email).first();
  const role = accountRole(c.env, email, existingByEmail?.role);

  if (existingByEmail) {
    await c.env.DB.prepare(
      `UPDATE users
       SET google_sub = ?, name = ?, avatar_url = ?, role = ?, updated_at = ?
       WHERE id = ?`
    ).bind(profile.sub, name, profile.picture || null, role, now, existingByEmail.id).run();
  } else {
    await c.env.DB.prepare(
      `INSERT INTO users (id, google_sub, email, name, avatar_url, role, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(google_sub) DO UPDATE SET
         email = excluded.email,
         name = excluded.name,
         avatar_url = excluded.avatar_url,
         role = excluded.role,
         updated_at = excluded.updated_at`
    ).bind(id, profile.sub, email, name, profile.picture || null, role, now, now).run();
  }

  const user = await c.env.DB.prepare("SELECT id FROM users WHERE google_sub = ?").bind(profile.sub).first();
  await createSession(c, user.id);
  return c.redirect(expected.returnTo || c.env.WEB_ORIGIN || "/");
});

app.get("/auth/twitch/start", async (c) => {
  if (!c.env.TWITCH_CLIENT_ID || !c.env.TWITCH_CLIENT_SECRET) {
    const returnTo = new URL(safeReturnTo(c.env, c.req.query("returnTo")));
    returnTo.searchParams.set("error", "twitch_oauth_not_configured");
    return c.redirect(returnTo.toString());
  }

  const state = randomToken();
  const returnTo = safeReturnTo(c.env, c.req.query("returnTo"));
  setOauthStateCookie(c, state, returnTo);

  const redirectUri = `${apiOrigin(c)}/auth/twitch/callback`;
  const params = new URLSearchParams({
    client_id: c.env.TWITCH_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "user:read:email",
    state,
    force_verify: "true"
  });

  return c.redirect(`https://id.twitch.tv/oauth2/authorize?${params.toString()}`);
});

app.get("/auth/twitch/callback", async (c) => {
  const expected = readOauthStateCookie(c);
  const state = c.req.query("state");
  const code = c.req.query("code");

  if (!expected || expected.state !== state || !code) {
    return fail("Invalid OAuth state", "invalid_oauth_state", 400);
  }

  clearOauthStateCookie(c);
  const redirectUri = `${apiOrigin(c)}/auth/twitch/callback`;
  const tokenResponse = await fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: c.env.TWITCH_CLIENT_ID,
      client_secret: c.env.TWITCH_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
      code
    })
  });

  if (!tokenResponse.ok) {
    return fail("Twitch token exchange failed", "oauth_exchange_failed", 502);
  }

  const tokenPayload = await tokenResponse.json();
  const profileResponse = await fetch("https://api.twitch.tv/helix/users", {
    headers: {
      "Client-Id": c.env.TWITCH_CLIENT_ID,
      Authorization: `Bearer ${tokenPayload.access_token}`
    }
  });

  if (!profileResponse.ok) {
    return fail("Twitch profile fetch failed", "oauth_profile_failed", 502);
  }

  const profilePayload = await profileResponse.json();
  const profile = profilePayload?.data?.[0];
  if (!profile?.id) return fail("Twitch profile is empty", "oauth_profile_failed", 502);

  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  const providerSub = `twitch:${profile.id}`;
  const realEmail = String(profile.email || "").trim().toLowerCase();
  const fallbackEmail = `twitch-${profile.id}@integro.local`;
  const conflictingEmail = realEmail
    ? await c.env.DB.prepare("SELECT id FROM users WHERE email = ? AND google_sub != ?").bind(realEmail, providerSub).first()
    : null;
  const email = realEmail && !conflictingEmail ? realEmail : fallbackEmail;
  const role = realEmail ? accountRole(c.env, realEmail) : "user";
  const name = displayNameForEmail(realEmail, profile.display_name || profile.login || "Twitch user");

  await c.env.DB.prepare(
    `INSERT INTO users (id, google_sub, email, name, avatar_url, role, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(google_sub) DO UPDATE SET
       email = excluded.email,
       name = excluded.name,
       avatar_url = excluded.avatar_url,
       role = excluded.role,
       updated_at = excluded.updated_at`
  ).bind(
    id,
    providerSub,
    email,
    name,
    profile.profile_image_url || null,
    role,
    now,
    now
  ).run();

  const user = await c.env.DB.prepare("SELECT id FROM users WHERE google_sub = ?").bind(providerSub).first();
  await createSession(c, user.id);
  return c.redirect(expected.returnTo || c.env.WEB_ORIGIN || "/");
});

app.post("/auth/logout", async (c) => {
  await clearSession(c);
  return c.json(ok());
});

app.get("/actions", async (c) => {
  const [rows, bridge] = await Promise.all([
    c.env.DB.prepare(
    `SELECT minecraft_actions.id,
            minecraft_actions.title,
            minecraft_actions.description,
            minecraft_actions.price,
            minecraft_actions.cooldown_seconds,
            minecraft_actions.is_enabled,
            minecraft_actions.sentiment,
            minecraft_actions.command_plan,
            minecraft_actions.command_mode,
            minecraft_actions.repeat_count,
            minecraft_actions.repeat_delay_ms,
            minecraft_actions.step_delay_ms,
            minecraft_actions.random_count,
            minecraft_actions.banner_url
     FROM minecraft_actions
     WHERE minecraft_actions.is_enabled = 1 AND minecraft_actions.deleted_at IS NULL
     ORDER BY minecraft_actions.created_at DESC`
    ).all(),
    bridgeFetch(c.env, "/status").then((response) => response.json()).catch(() => ({ connected: false, sockets: 0, queued: 0 }))
  ]);
  return c.json(ok({ actions: mapActions(rows.results || []), bridge }));
});

app.post("/actions/:id/purchase", requireUser, async (c) => {
  const user = c.get("user");
  const actionId = c.req.param("id");
  const [action, bridge] = await Promise.all([
    c.env.DB.prepare(
      `SELECT minecraft_actions.*
       FROM minecraft_actions
       WHERE minecraft_actions.id = ? AND minecraft_actions.is_enabled = 1 AND minecraft_actions.deleted_at IS NULL`
    ).bind(actionId).first(),
    bridgeFetch(c.env, "/status").then((response) => response.json()).catch(() => ({ connected: false }))
  ]);

  if (!action) return fail("Action is not available", "action_unavailable", 404);
  if (!bridge?.connected) return fail("Streamer is offline", "bridge_offline", 409);

  const purchaseId = crypto.randomUUID();
  const txId = crypto.randomUUID();
  const now = new Date().toISOString();
  const commandSteps = renderCommandSteps(action, user);
  const commandSnapshot = JSON.stringify(commandSteps);
  const purchasePrice = Math.max(1, Number(action.price) || 1);

  const batch = await c.env.DB.batch([
    c.env.DB.prepare(
      "UPDATE users SET balance = balance - ?, updated_at = ? WHERE id = ? AND balance >= ?"
    ).bind(purchasePrice, now, user.id, purchasePrice),
    c.env.DB.prepare(
      `INSERT INTO action_purchases (id, user_id, action_id, amount, status, command_snapshot, created_at)
       SELECT ?, ?, ?, ?, 'queued', ?, ? WHERE changes() = 1`
    ).bind(purchaseId, user.id, actionId, purchasePrice, commandSnapshot, now),
    c.env.DB.prepare(
      `INSERT INTO balance_transactions (id, user_id, type, amount, reference_id, note, created_at)
       SELECT ?, ?, 'action_purchase', ?, ?, ?, ? WHERE changes() = 1`
    ).bind(txId, user.id, -purchasePrice, purchaseId, action.title, now)
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

app.get("/me/stats", requireUser, async (c) => {
  const user = c.get("user");
  const [transactions, purchases] = await Promise.all([
    c.env.DB.prepare(
      `SELECT
         COALESCE(SUM(CASE WHEN type = 'voucher_redeem' THEN amount ELSE 0 END), 0) AS total_received,
         COALESCE(SUM(CASE WHEN type = 'action_purchase' THEN -amount ELSE 0 END), 0) AS total_spent,
         COALESCE(SUM(CASE WHEN type = 'action_refund' THEN amount ELSE 0 END), 0) AS total_refunded
       FROM balance_transactions
       WHERE user_id = ?`
    ).bind(user.id).first(),
    c.env.DB.prepare(
      `SELECT
         COUNT(*) AS purchases_count,
         COALESCE(SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END), 0) AS completed_count,
         COALESCE(SUM(CASE WHEN status = 'queued' THEN 1 ELSE 0 END), 0) AS queued_count
       FROM action_purchases
       WHERE user_id = ?`
    ).bind(user.id).first()
  ]);

  return c.json(ok({
    stats: {
      balance: user.balance,
      totalReceived: transactions?.total_received || 0,
      totalSpent: transactions?.total_spent || 0,
      totalRefunded: transactions?.total_refunded || 0,
      purchasesCount: purchases?.purchases_count || 0,
      completedCount: purchases?.completed_count || 0,
      queuedCount: purchases?.queued_count || 0
    }
  }));
});

app.post("/vouchers/redeem", requireUser, async (c) => {
  const user = c.get("user");
  const body = await c.req.json().catch(() => ({}));
  const code = normalizeCode(body.code);
  if (!code) return fail("Voucher code is required", "invalid_code", 400);

  const voucher = await c.env.DB.prepare("SELECT * FROM vouchers WHERE code = ?").bind(code).first();
  if (!voucher || !voucher.is_active || voucher.deleted_at) return fail("Voucher is not active", "voucher_inactive", 404);
  if (voucher.expires_at && new Date(voucher.expires_at) < new Date()) {
    return fail("Voucher has expired", "voucher_expired", 410);
  }

  const redemptionId = crypto.randomUUID();
  const txId = crypto.randomUUID();
  const now = new Date().toISOString();
  const perUserLimit = clampNumber(voucher.per_user_limit || 1, 1, 100000);
  const cooldownSeconds = clampNumber(voucher.per_user_cooldown_seconds || 0, 0, 31536000);

  const batch = await c.env.DB.batch([
    c.env.DB.prepare(
      `UPDATE vouchers
       SET redeemed_count = redeemed_count + 1, updated_at = ?
       WHERE id = ?
         AND is_active = 1
         AND redeemed_count < max_redemptions
         AND (expires_at IS NULL OR expires_at > ?)
         AND (
           SELECT COUNT(*) FROM voucher_redemptions
           WHERE voucher_id = ? AND user_id = ?
         ) < ?
         AND (
           ? = 0 OR NOT EXISTS (
             SELECT 1 FROM voucher_redemptions
             WHERE voucher_id = ? AND user_id = ? AND created_at > datetime(?, ?)
           )
         )`
    ).bind(
      now,
      voucher.id,
      now,
      voucher.id,
      user.id,
      perUserLimit,
      cooldownSeconds,
      voucher.id,
      user.id,
      now,
      `-${cooldownSeconds} seconds`
    ),
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
    return fail("Voucher was already used, on cooldown, or limit reached", "voucher_unavailable", 409);
  }

  return c.json(ok({ coins: voucher.coins }));
});

app.get("/admin/overview", requireAdmin, async (c) => {
  const [actions, vouchers, users, balances, purchases, bridge] = await Promise.all([
    c.env.DB.prepare(
      `SELECT
         COUNT(*) AS count,
         COALESCE(SUM(CASE WHEN is_enabled = 1 THEN 1 ELSE 0 END), 0) AS enabled_count
       FROM minecraft_actions
       WHERE deleted_at IS NULL`
    ).first(),
    c.env.DB.prepare(
      `SELECT
         COUNT(*) AS count,
         COALESCE(SUM(CASE WHEN is_active = 1 AND redeemed_count < max_redemptions THEN 1 ELSE 0 END), 0) AS active_count,
         COALESCE(SUM(redeemed_count), 0) AS redemptions_count
       FROM vouchers
       WHERE deleted_at IS NULL`
    ).first(),
    c.env.DB.prepare("SELECT COUNT(*) AS count FROM users").first(),
    c.env.DB.prepare(
      `SELECT
         COALESCE(SUM(CASE WHEN type = 'voucher_redeem' THEN amount ELSE 0 END), 0) AS total_received,
         COALESCE(SUM(CASE WHEN type = 'action_purchase' THEN -amount ELSE 0 END), 0) AS total_spent,
         COALESCE(SUM(CASE WHEN type = 'action_refund' THEN amount ELSE 0 END), 0) AS total_refunded
       FROM balance_transactions`
    ).first(),
    c.env.DB.prepare(
      `SELECT
         COUNT(*) AS count,
         COALESCE(SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END), 0) AS completed_count,
         COALESCE(SUM(CASE WHEN status = 'queued' THEN 1 ELSE 0 END), 0) AS queued_count,
         COALESCE(SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END), 0) AS failed_count
       FROM action_purchases`
    ).first(),
    bridgeFetch(c.env, "/status").then((response) => response.json()).catch(() => ({ connected: false, sockets: 0, queued: 0 }))
  ]);
  return c.json(ok({
    actionsCount: actions?.count || 0,
    enabledActionsCount: actions?.enabled_count || 0,
    vouchersCount: vouchers?.count || 0,
    activeVouchersCount: vouchers?.active_count || 0,
    voucherRedemptionsCount: vouchers?.redemptions_count || 0,
    usersCount: users?.count || 0,
    totalReceived: balances?.total_received || 0,
    totalSpent: balances?.total_spent || 0,
    totalRefunded: balances?.total_refunded || 0,
    purchasesCount: purchases?.count || 0,
    completedPurchasesCount: purchases?.completed_count || 0,
    queuedPurchasesCount: purchases?.queued_count || 0,
    failedPurchasesCount: purchases?.failed_count || 0,
    bridge
  }));
});

app.get("/admin/actions", requireAdmin, async (c) => {
  const rows = await c.env.DB.prepare(
    `SELECT minecraft_actions.*
     FROM minecraft_actions
     WHERE minecraft_actions.deleted_at IS NULL
     ORDER BY minecraft_actions.created_at DESC`
  ).all();
  return c.json(ok({ actions: mapActions(rows.results || [], true) }));
});

app.post("/admin/actions", requireAdmin, async (c) => {
  try {
    const body = await c.req.json();
    const now = new Date().toISOString();
    const commands = normalizeCommandPlan(body.commands, body.command);
    const row = {
      id: crypto.randomUUID(),
      title: requireString(body.title, "title", 2, 80),
      description: String(body.description || "").trim().slice(0, 500),
      price: requireInt(body.price, "price", 1),
      command: commands[0],
      commands,
      commandMode: normalizeCommandMode(body.commandMode),
      sentiment: normalizeSentiment(body.sentiment),
      randomCount: requireInt(body.randomCount || 1, "randomCount", 1, 20),
      repeatCount: 1,
      repeatDelayMs: 0,
      stepDelayMs: requireInt(body.stepDelayMs || 0, "stepDelayMs", 0, 600000),
      bannerUrl: normalizeUrl(body.bannerUrl),
      cooldownSeconds: 0
    };
    await c.env.DB.prepare(
      `INSERT INTO minecraft_actions
       (id, title, description, price, command, command_plan, command_mode, repeat_count,
        repeat_delay_ms, step_delay_ms, random_count, banner_url, sentiment, cooldown_seconds, is_enabled, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`
    ).bind(
      row.id,
      row.title,
      row.description,
      row.price,
      row.command,
      JSON.stringify(row.commands),
      row.commandMode,
      row.repeatCount,
      row.repeatDelayMs,
      row.stepDelayMs,
      row.randomCount,
      row.bannerUrl,
      row.sentiment,
      row.cooldownSeconds,
      now,
      now
    ).run();
    return c.json(ok({ action: row }), 201);
  } catch (err) {
    return fail(err.message, "validation_error", 400);
  }
});

app.patch("/admin/actions/:id", requireAdmin, async (c) => {
  try {
    const body = await c.req.json().catch(() => ({}));
    const existing = await c.env.DB.prepare("SELECT * FROM minecraft_actions WHERE id = ?").bind(c.req.param("id")).first();
    if (!existing) return fail("Action not found", "not_found", 404);

    const next = {
      title: body.title === undefined ? existing.title : requireString(body.title, "title", 2, 80),
      description: body.description === undefined ? existing.description : String(body.description || "").trim().slice(0, 500),
      price: body.price === undefined ? existing.price : requireInt(body.price, "price", 1),
      commands: body.commands === undefined && body.command === undefined
        ? parseCommandPlan(existing.command_plan, existing.command)
        : normalizeCommandPlan(body.commands, body.command),
      commandMode: body.commandMode === undefined ? existing.command_mode : normalizeCommandMode(body.commandMode),
      sentiment: body.sentiment === undefined ? existing.sentiment || "good" : normalizeSentiment(body.sentiment),
      randomCount: body.randomCount === undefined ? existing.random_count || 1 : requireInt(body.randomCount, "randomCount", 1, 20),
      repeatCount: 1,
      repeatDelayMs: 0,
      stepDelayMs: body.stepDelayMs === undefined ? existing.step_delay_ms : requireInt(body.stepDelayMs, "stepDelayMs", 0, 600000),
      bannerUrl: body.bannerUrl === undefined ? existing.banner_url : normalizeUrl(body.bannerUrl),
      cooldownSeconds: 0,
      isEnabled: body.isEnabled === undefined ? existing.is_enabled : body.isEnabled ? 1 : 0
    };
    next.command = next.commands[0];

    await c.env.DB.prepare(
      `UPDATE minecraft_actions
       SET title = ?, description = ?, price = ?, command = ?, command_plan = ?, command_mode = ?,
           repeat_count = ?, repeat_delay_ms = ?, step_delay_ms = ?, random_count = ?, banner_url = ?,
           sentiment = ?, cooldown_seconds = ?, is_enabled = ?, updated_at = ?
       WHERE id = ?`
    ).bind(
      next.title,
      next.description,
      next.price,
      next.command,
      JSON.stringify(next.commands),
      next.commandMode,
      next.repeatCount,
      next.repeatDelayMs,
      next.stepDelayMs,
      next.randomCount,
      next.bannerUrl,
      next.sentiment,
      next.cooldownSeconds,
      next.isEnabled,
      new Date().toISOString(),
      existing.id
    ).run();
    return c.json(ok());
  } catch (err) {
    return fail(err.message, "validation_error", 400);
  }
});

app.post("/admin/actions/:id/test", requireAdmin, async (c) => {
  const user = c.get("user");
  const action = await c.env.DB.prepare(
    `SELECT *
     FROM minecraft_actions
     WHERE id = ? AND deleted_at IS NULL`
  ).bind(c.req.param("id")).first();
  if (!action) return fail("Action not found", "not_found", 404);

  const commandSteps = renderCommandSteps(action, user);
  const response = await bridgeFetch(c.env, "/dispatch-test", {
    method: "POST",
    body: JSON.stringify({
      title: `Тест: ${action.title}`,
      commands: commandSteps,
      userName: user.name || "Стример"
    })
  }).then((item) => item.json()).catch(() => ({ sent: false }));

  if (!response?.sent) return fail("Bridge is offline", "bridge_offline", 409);
  return c.json(ok({ sent: true }));
});

app.delete("/admin/actions/:id", requireAdmin, async (c) => {
  const actionId = c.req.param("id");
  await c.env.DB.batch([
    c.env.DB.prepare(
      `DELETE FROM bridge_command_logs
       WHERE purchase_id IN (SELECT id FROM action_purchases WHERE action_id = ?)`
    ).bind(actionId),
    c.env.DB.prepare("DELETE FROM action_purchases WHERE action_id = ?").bind(actionId),
    c.env.DB.prepare("DELETE FROM minecraft_actions WHERE id = ?").bind(actionId)
  ]);
  return c.json(ok());
});

app.get("/admin/vouchers", requireAdmin, async (c) => {
  const rows = await c.env.DB.prepare("SELECT * FROM vouchers WHERE deleted_at IS NULL ORDER BY created_at DESC LIMIT 200").all();
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
      perUserLimit: requireInt(body.perUserLimit || 1, "perUserLimit", 1, 100000),
      perUserCooldownSeconds: requireInt(body.perUserCooldownSeconds || 0, "perUserCooldownSeconds", 0, 31536000),
      expiresAt: optionalDate(body.expiresAt)
    };
    await c.env.DB.prepare(
      `INSERT INTO vouchers
       (id, code, coins, max_redemptions, redeemed_count, per_user_limit, per_user_cooldown_seconds,
        expires_at, is_active, created_by, created_at, updated_at)
       VALUES (?, ?, ?, ?, 0, ?, ?, ?, 1, ?, ?, ?)`
    ).bind(
      row.id,
      row.code,
      row.coins,
      row.maxRedemptions,
      row.perUserLimit,
      row.perUserCooldownSeconds,
      row.expiresAt,
      user.id,
      now,
      now
    ).run();
    return c.json(ok({ voucher: row }), 201);
  } catch (err) {
    if (String(err.message || "").includes("UNIQUE constraint failed: vouchers.code")) {
      return fail("Такой код ваучера уже существует. Введи другой код или нажми сгенерировать.", "voucher_code_exists", 409);
    }
    return fail(err.message, "validation_error", 400);
  }
});

app.patch("/admin/vouchers/:id", requireAdmin, async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const existing = await c.env.DB.prepare("SELECT * FROM vouchers WHERE id = ?").bind(c.req.param("id")).first();
  if (!existing) return fail("Voucher not found", "not_found", 404);
  await c.env.DB.prepare(
    `UPDATE vouchers
     SET is_active = ?, per_user_limit = ?, per_user_cooldown_seconds = ?, updated_at = ?
     WHERE id = ?`
  ).bind(
    body.isActive === undefined ? existing.is_active : body.isActive ? 1 : 0,
    body.perUserLimit === undefined ? existing.per_user_limit || 1 : requireInt(body.perUserLimit, "perUserLimit", 1, 100000),
    body.perUserCooldownSeconds === undefined ? existing.per_user_cooldown_seconds || 0 : requireInt(body.perUserCooldownSeconds, "perUserCooldownSeconds", 0, 31536000),
    new Date().toISOString(),
    existing.id
  ).run();
  return c.json(ok());
});

app.delete("/admin/vouchers/:id", requireAdmin, async (c) => {
  const existing = await c.env.DB.prepare(
    "SELECT * FROM vouchers WHERE id = ? AND deleted_at IS NULL"
  ).bind(c.req.param("id")).first();
  if (!existing) return fail("Voucher not found", "not_found", 404);

  await c.env.DB.batch([
    c.env.DB.prepare("DELETE FROM voucher_redemptions WHERE voucher_id = ?").bind(existing.id),
    c.env.DB.prepare("DELETE FROM vouchers WHERE id = ?").bind(existing.id)
  ]);
  return c.json(ok());
});

app.get("/admin/users", requireAdmin, async (c) => {
  const rows = await c.env.DB.prepare(
    `SELECT users.id,
            users.email,
            users.name,
            users.avatar_url,
            users.role,
            users.balance,
            users.created_at,
            COALESCE(stats.total_received, 0) AS total_received,
            COALESCE(stats.total_spent, 0) AS total_spent,
            COALESCE(stats.total_refunded, 0) AS total_refunded,
            COALESCE(purchases.purchases_count, 0) AS purchases_count
     FROM users
     LEFT JOIN (
       SELECT user_id,
              COALESCE(SUM(CASE WHEN type = 'voucher_redeem' THEN amount ELSE 0 END), 0) AS total_received,
              COALESCE(SUM(CASE WHEN type = 'action_purchase' THEN -amount ELSE 0 END), 0) AS total_spent,
              COALESCE(SUM(CASE WHEN type = 'action_refund' THEN amount ELSE 0 END), 0) AS total_refunded
       FROM balance_transactions
       GROUP BY user_id
     ) stats ON stats.user_id = users.id
     LEFT JOIN (
       SELECT user_id, COUNT(*) AS purchases_count
       FROM action_purchases
       GROUP BY user_id
     ) purchases ON purchases.user_id = users.id
     ORDER BY users.created_at DESC
     LIMIT 200`
  ).all();
  return c.json(ok({ users: (rows.results || []).map((row) => ({
    id: row.id,
    email: row.email,
    name: row.name,
    avatarUrl: row.avatar_url,
    role: row.role,
    balance: row.balance,
    createdAt: row.created_at,
    totalReceived: row.total_received,
    totalSpent: row.total_spent,
    totalRefunded: row.total_refunded,
    purchasesCount: row.purchases_count
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

app.post("/admin/reset", requireAdmin, async (c) => {
  const now = new Date().toISOString();
  await c.env.DB.batch([
    c.env.DB.prepare("DELETE FROM sessions WHERE user_id IN (SELECT id FROM users WHERE role NOT IN ('admin', 'developer', 'streamer'))"),
    c.env.DB.prepare("DELETE FROM balance_transactions"),
    c.env.DB.prepare("DELETE FROM voucher_redemptions"),
    c.env.DB.prepare("DELETE FROM action_purchases"),
    c.env.DB.prepare("UPDATE vouchers SET redeemed_count = 0, updated_at = ? WHERE deleted_at IS NULL").bind(now),
    c.env.DB.prepare("DELETE FROM users WHERE role NOT IN ('admin', 'developer', 'streamer')"),
    c.env.DB.prepare("UPDATE users SET balance = 0, updated_at = ? WHERE role IN ('admin', 'developer', 'streamer')").bind(now)
  ]);
  return c.json(ok());
});

app.post("/admin/users/:id/balance", requireAdmin, async (c) => {
  try {
    const result = await adjustUserBalance(c, c.req.param("id"), "streamer_panel");
    return c.json(ok(result));
  } catch (err) {
    return fail(err.message, "balance_adjust_failed", 400);
  }
});

app.get("/developer/users", requireDeveloper, async (c) => {
  const rows = await c.env.DB.prepare(
    `SELECT users.id,
            users.email,
            users.name,
            users.avatar_url,
            users.role,
            users.balance,
            users.created_at,
            users.updated_at,
            COALESCE(stats.total_received, 0) AS total_received,
            COALESCE(stats.total_spent, 0) AS total_spent,
            COALESCE(purchases.purchases_count, 0) AS purchases_count
     FROM users
     LEFT JOIN (
       SELECT user_id,
              COALESCE(SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END), 0) AS total_received,
              COALESCE(SUM(CASE WHEN type = 'action_purchase' THEN -amount ELSE 0 END), 0) AS total_spent
       FROM balance_transactions
       GROUP BY user_id
     ) stats ON stats.user_id = users.id
     LEFT JOIN (
       SELECT user_id, COUNT(*) AS purchases_count
       FROM action_purchases
       GROUP BY user_id
     ) purchases ON purchases.user_id = users.id
     ORDER BY users.created_at DESC
     LIMIT 500`
  ).all();
  return c.json(ok({ users: (rows.results || []).map(mapDeveloperUser) }));
});

app.patch("/developer/users/:id/role", requireDeveloper, async (c) => {
  const actor = c.get("user");
  const body = await c.req.json().catch(() => ({}));
  const role = normalizeRole(body.role);
  if (!role) return fail("Invalid role", "invalid_role", 400);
  if (actor.id === c.req.param("id") && role !== "developer") {
    return fail("You cannot remove your own developer access", "self_role_change_forbidden", 409);
  }

  const existing = await c.env.DB.prepare("SELECT id FROM users WHERE id = ?").bind(c.req.param("id")).first();
  if (!existing) return fail("User not found", "not_found", 404);

  await c.env.DB.prepare("UPDATE users SET role = ?, updated_at = ? WHERE id = ?")
    .bind(role, new Date().toISOString(), existing.id)
    .run();
  await logEvent(c.env, {
    level: "info",
    source: "developer.roles",
    message: `Role changed to ${role}`,
    userId: actor.id,
    metadata: { targetUserId: existing.id, role }
  });
  return c.json(ok());
});

app.post("/developer/streamers", requireDeveloper, async (c) => {
  const actor = c.get("user");
  const body = await c.req.json().catch(() => ({}));
  const email = normalizeEmail(body.email);
  if (!email || !email.includes("@")) return fail("Email is required", "invalid_email", 400);
  const role = normalizeRole(body.role) || "streamer";
  const name = String(body.name || email.split("@")[0]).trim().slice(0, 80);
  const existing = await c.env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();
  const now = new Date().toISOString();
  const userId = existing?.id || crypto.randomUUID();
  if (existing) {
    await c.env.DB.prepare("UPDATE users SET role = ?, name = COALESCE(NULLIF(name, ''), ?), updated_at = ? WHERE id = ?")
      .bind(role, name, now, existing.id)
      .run();
  } else {
    await c.env.DB.prepare(
      `INSERT INTO users (id, google_sub, email, name, role, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(userId, `manual:${crypto.randomUUID()}`, email, name, role, now, now).run();
  }
  await logEvent(c.env, {
    level: "info",
    source: "developer.roles",
    message: `Role assigned: ${email} -> ${role}`,
    userId: actor.id,
    metadata: { targetUserId: userId, email, role }
  });
  return c.json(ok({ userId, role }));
});

app.post("/developer/users/:id/balance", requireDeveloper, async (c) => {
  try {
    const result = await adjustUserBalance(c, c.req.param("id"), "developer_panel");
    return c.json(ok(result));
  } catch (err) {
    return fail(err.message, "balance_adjust_failed", 400);
  }
});

app.get("/developer/bridge-devices", requireDeveloper, async (c) => {
  const rows = await c.env.DB.prepare(
    `SELECT bridge_devices.id,
            bridge_devices.name,
            bridge_devices.mod_version,
            bridge_devices.minecraft_version,
            bridge_devices.computer_name,
            bridge_devices.os_name,
            bridge_devices.os_version,
            bridge_devices.java_version,
            bridge_devices.minecraft_user,
            bridge_devices.client_locale,
            bridge_devices.ip_address,
            bridge_devices.user_agent,
            bridge_devices.created_at,
            bridge_devices.last_seen_at,
            bridge_devices.revoked_at,
            users.name AS user_name,
            users.email AS user_email,
            users.role AS user_role
     FROM bridge_devices
     JOIN users ON users.id = bridge_devices.user_id
     WHERE bridge_devices.revoked_at IS NULL
     ORDER BY COALESCE(bridge_devices.last_seen_at, bridge_devices.created_at) DESC
     LIMIT 200`
  ).all();
  return c.json(ok({ devices: rows.results || [] }));
});

app.delete("/developer/bridge-devices/:id", requireDeveloper, async (c) => {
  await c.env.DB.prepare("DELETE FROM bridge_devices WHERE id = ?").bind(c.req.param("id")).run();
  await logEvent(c.env, {
    level: "warn",
    source: "developer.bridge",
    message: "Bridge device deleted",
    userId: c.get("user").id,
    metadata: { deviceId: c.req.param("id") }
  });
  return c.json(ok());
});

app.get("/developer/logs", requireDeveloper, async (c) => {
  const source = String(c.req.query("source") || "all");
  const level = String(c.req.query("level") || "all");
  const clauses = [];
  const binds = [];
  if (source !== "all") {
    clauses.push("source = ?");
    binds.push(source);
  }
  if (level !== "all") {
    clauses.push("level = ?");
    binds.push(level);
  }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const statement = c.env.DB.prepare(
    `SELECT system_logs.*, users.email AS user_email, users.name AS user_name
     FROM system_logs
     LEFT JOIN users ON users.id = system_logs.user_id
     ${where}
     ORDER BY system_logs.created_at DESC
     LIMIT 300`
  );
  const rows = binds.length ? await statement.bind(...binds).all() : await statement.all();
  return c.json(ok({ logs: (rows.results || []).map(mapSystemLog) }));
});

app.get("/developer/command-logs", requireDeveloper, async (c) => {
  const rows = await c.env.DB.prepare(
    `SELECT *
     FROM bridge_command_logs
     ORDER BY created_at DESC
     LIMIT 300`
  ).all();
  return c.json(ok({ logs: (rows.results || []).map(mapCommandLog) }));
});

app.post("/bridge/device/start", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  const code = deviceCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
  const deviceName = String(body.deviceName || "Minecraft").trim().slice(0, 80);
  const modVersion = String(body.modVersion || "").trim().slice(0, 40);
  const minecraftVersion = String(body.minecraftVersion || "").trim().slice(0, 40);
  const computerName = String(body.computerName || "").trim().slice(0, 120);
  const osName = String(body.osName || "").trim().slice(0, 80);
  const osVersion = String(body.osVersion || "").trim().slice(0, 80);
  const javaVersion = String(body.javaVersion || "").trim().slice(0, 80);
  const minecraftUser = String(body.minecraftUser || "").trim().slice(0, 80);
  const clientLocale = String(body.clientLocale || "").trim().slice(0, 40);
  const ipAddress = requestIp(c);
  const userAgent = String(c.req.header("User-Agent") || "").trim().slice(0, 240);

  await c.env.DB.prepare(
    `INSERT INTO bridge_device_codes
     (id, code, device_name, mod_version, minecraft_version, computer_name, os_name,
      os_version, java_version, minecraft_user, client_locale, ip_address, user_agent, status, expires_at, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)`
  ).bind(
    id,
    code,
    deviceName,
    modVersion,
    minecraftVersion,
    computerName,
    osName,
    osVersion,
    javaVersion,
    minecraftUser,
    clientLocale,
    ipAddress,
    userAgent,
    expiresAt,
    now
  ).run();

  const loginUrl = `${apiOrigin(c)}/bridge/link?code=${encodeURIComponent(code)}`;
  return c.json(ok({ code, loginUrl, expiresAt, pollAfterMs: 2500 }));
});

app.get("/bridge/link", async (c) => {
  const code = normalizeDeviceCode(c.req.query("code"));
  if (!code) return fail("Device code is required", "invalid_device_code", 400);
  const user = await currentUser(c);
  const returnTo = `${apiOrigin(c)}/bridge/link?code=${encodeURIComponent(code)}`;
  if (!user) {
    return c.redirect(`${apiOrigin(c)}/auth/google/start?returnTo=${encodeURIComponent(returnTo)}`);
  }

  const pending = await c.env.DB.prepare(
    "SELECT * FROM bridge_device_codes WHERE code = ? AND status = 'pending'"
  ).bind(code).first();
  if (!pending || new Date(pending.expires_at) < new Date()) {
    return bridgeLinkPage("Код устарел", "Вернись в Minecraft и нажми Start еще раз.", false);
  }

  if (!canConnectBridge(user)) {
    await c.env.DB.prepare(
      "UPDATE bridge_device_codes SET status = 'denied', denied_reason = ?, approved_user_id = ?, approved_at = ? WHERE id = ?"
    ).bind("Недостаточно прав. Bridge может подключить только стример.", user.id, new Date().toISOString(), pending.id).run();
    return bridgeLinkPage("Нет доступа", "Этот Google-аккаунт не имеет роли стримера или разработчика.", false);
  }

  const token = randomToken();
  const tokenHash = await sha256Hex(token);
  const deviceId = crypto.randomUUID();
  const now = new Date().toISOString();
  await c.env.DB.batch([
    c.env.DB.prepare(
      `INSERT INTO bridge_devices
       (id, user_id, token_hash, name, mod_version, minecraft_version, computer_name, os_name,
        os_version, java_version, minecraft_user, client_locale, ip_address, user_agent, created_at, last_seen_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      deviceId,
      user.id,
      tokenHash,
      pending.device_name,
      pending.mod_version,
      pending.minecraft_version,
      pending.computer_name,
      pending.os_name,
      pending.os_version,
      pending.java_version,
      pending.minecraft_user,
      pending.client_locale,
      pending.ip_address,
      pending.user_agent,
      now,
      now
    ),
    c.env.DB.prepare(
      `UPDATE bridge_device_codes
       SET status = 'approved', approved_user_id = ?, approved_device_id = ?, device_token = ?, approved_at = ?
       WHERE id = ?`
    ).bind(user.id, deviceId, token, now, pending.id)
  ]);

  return bridgeLinkPage("Bridge подключен", "Можешь вернуться в Minecraft. Мод подключится автоматически.", true);
});

app.get("/bridge/device/poll", async (c) => {
  const code = normalizeDeviceCode(c.req.query("code"));
  if (!code) return fail("Device code is required", "invalid_device_code", 400);
  const row = await c.env.DB.prepare(
    `SELECT bridge_device_codes.*,
            users.name AS user_name,
            users.role AS user_role
     FROM bridge_device_codes
     LEFT JOIN users ON users.id = bridge_device_codes.approved_user_id
     WHERE bridge_device_codes.code = ?`
  ).bind(code).first();

  if (!row) return fail("Device code not found", "not_found", 404);
  if (new Date(row.expires_at) < new Date() && row.status === "pending") {
    await c.env.DB.prepare("UPDATE bridge_device_codes SET status = 'expired' WHERE id = ?").bind(row.id).run();
    return c.json(ok({ status: "expired" }));
  }
  if (row.status === "approved" && row.device_token) {
    await c.env.DB.prepare("UPDATE bridge_device_codes SET device_token = NULL WHERE id = ?").bind(row.id).run();
    return c.json(ok({
      status: "approved",
      token: row.device_token,
      streamerName: row.user_name,
      role: row.user_role
    }));
  }
  return c.json(ok({ status: row.status, reason: row.denied_reason || null }));
});

app.get("/bridge/connect", async (c) => {
  return bridgeFetch(c.env, "/connect", c.req.raw);
});

app.post("/bridge/flush", requireAdmin, async (c) => {
  const response = await bridgeFetch(c.env, "/flush", { method: "POST" });
  return c.json(ok(await response.json()));
});

function apiOrigin(c) {
  const requestOrigin = new URL(c.req.url).origin;
  if (requestOrigin.endsWith(".workers.dev")) return requestOrigin;
  return c.env.API_ORIGIN || requestOrigin;
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function requestIp(c) {
  const cfIp = c.req.header("CF-Connecting-IP") || c.req.header("cf-connecting-ip");
  if (cfIp) return String(cfIp).trim().slice(0, 80);
  const forwarded = c.req.header("X-Forwarded-For") || c.req.header("x-forwarded-for") || "";
  return String(forwarded).split(",")[0].trim().slice(0, 80);
}

function accountRole(env, email, existingRole = "") {
  const normalized = normalizeEmail(email);
  if (normalized === "bogdan3000tm@gmail.com") return "tester";
  if (normalized === "ihnatenko.bogdan@gmail.com") return "developer";
  if (["streamer", "developer", "tester"].includes(existingRole)) return existingRole;
  return isAdminEmail(env, normalized) ? "streamer" : "user";
}

function displayNameForEmail(email, fallback) {
  return String(fallback || email || "Пользователь").trim();
}

function renderCommand(template, user) {
  return template
    .replaceAll("{user}", sanitizeCommandPart(user.name || user.email))
    .replaceAll("{email}", sanitizeCommandPart(user.email));
}

function renderCommandSteps(action, user) {
  const commands = parseCommandPlan(action.command_plan, action.command);
  const mode = normalizeCommandMode(action.command_mode || "sequence");
  const stepDelayMs = clampNumber(action.step_delay_ms || 0, 0, 600000);
  const randomCount = clampNumber(action.random_count || 1, 1, commands.length || 1);
  const currentCommands = mode === "random"
    ? shuffle(commands).slice(0, randomCount)
    : commands;
  const steps = currentCommands.map((command, index) => ({
    command: renderCommand(command, user),
    delayMs: index === 0 ? 0 : stepDelayMs
  }));

  return steps.slice(0, 120);
}

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[target]] = [copy[target], copy[index]];
  }
  return copy;
}

function normalizeCommandPlan(commands, fallbackCommand) {
  const rawCommands = Array.isArray(commands)
    ? commands
    : String(fallbackCommand || "").split(/\r?\n/);
  const cleaned = rawCommands
    .map((command) => String(command || "").trim())
    .filter(Boolean)
    .slice(0, 20)
    .map((command) => command.slice(0, 400));

  if (cleaned.length === 0) throw new Error("command is required");
  return cleaned;
}

function parseCommandPlan(commandPlan, fallbackCommand) {
  try {
    const parsed = JSON.parse(commandPlan || "null");
    if (Array.isArray(parsed)) {
      const cleaned = normalizeCommandPlan(parsed, "");
      if (cleaned.length > 0) return cleaned;
    }
  } catch {
    // Old actions used a single command string.
  }
  return normalizeCommandPlan(undefined, fallbackCommand);
}

function normalizeCommandMode(value) {
  return value === "random" ? "random" : "sequence";
}

function normalizeSentiment(value) {
  return value === "bad" ? "bad" : "good";
}

function normalizeUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) return null;
  if (raw.length > 10000000) throw new Error("bannerUrl is too long");
  if (raw.startsWith("data:image/")) return raw;
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      throw new Error("bannerUrl must be http or https");
    }
    return url.toString();
  } catch {
    throw new Error("bannerUrl is invalid");
  }
}

function clampNumber(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.max(min, Math.min(max, Math.trunc(number)));
}

async function adjustUserBalance(c, targetUserId, source) {
  const body = await c.req.json().catch(() => ({}));
  const mode = body.mode === "set" || body.mode === "deduct" ? body.mode : "grant";
  const amount = requireInt(body.amount, "amount", 0, 1000000000);
  const note = String(body.reason || "Ручная корректировка").trim().slice(0, 240);
  const target = await c.env.DB.prepare("SELECT id, balance FROM users WHERE id = ?").bind(targetUserId).first();
  if (!target) throw new Error("User not found");

  const delta = mode === "set" ? amount - Number(target.balance || 0) : mode === "deduct" ? -amount : amount;
  const nextBalance = Number(target.balance || 0) + delta;
  if (nextBalance < 0) throw new Error("Balance cannot be negative");

  const now = new Date().toISOString();
  const txId = crypto.randomUUID();
  await c.env.DB.batch([
    c.env.DB.prepare("UPDATE users SET balance = ?, updated_at = ? WHERE id = ?").bind(nextBalance, now, target.id),
    c.env.DB.prepare(
      `INSERT INTO balance_transactions (id, user_id, type, amount, reference_id, note, created_at)
       VALUES (?, ?, 'manual_adjustment', ?, ?, ?, ?)`
    ).bind(txId, target.id, delta, c.get("user").id, note, now)
  ]);
  await logEvent(c.env, {
    level: "info",
    source,
    message: `Balance adjusted by ${delta}`,
    userId: c.get("user").id,
    metadata: { targetUserId, mode, amount, delta, nextBalance, note }
  });
  return { balance: nextBalance, delta };
}

function normalizeRole(value) {
  const role = String(value || "").trim().toLowerCase();
  return ["user", "tester", "streamer", "developer"].includes(role) ? role : "";
}

function mapDeveloperUser(row) {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    avatarUrl: row.avatar_url,
    role: row.role,
    balance: row.balance,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    totalReceived: row.total_received,
    totalSpent: row.total_spent,
    purchasesCount: row.purchases_count
  };
}

function mapSystemLog(row) {
  return {
    id: row.id,
    level: row.level,
    source: row.source,
    message: row.message,
    metadata: parseJson(row.metadata, {}),
    userName: row.user_name,
    userEmail: row.user_email,
    createdAt: row.created_at
  };
}

function mapCommandLog(row) {
  return {
    id: row.id,
    source: row.source,
    purchaseId: row.purchase_id,
    actionTitle: row.action_title,
    userName: row.user_name,
    status: row.status,
    message: row.message,
    commands: parseJson(row.command_snapshot, []),
    createdAt: row.created_at,
    completedAt: row.completed_at
  };
}

function parseJson(value, fallback) {
  try {
    return JSON.parse(value || "null") ?? fallback;
  } catch {
    return fallback;
  }
}

async function logEvent(env, { level = "info", source, message, userId = null, metadata = {} }) {
  try {
    await env.DB.prepare(
      `INSERT INTO system_logs (id, level, source, message, user_id, metadata, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      crypto.randomUUID(),
      level,
      source,
      String(message || "").slice(0, 500),
      userId,
      JSON.stringify(metadata || {}),
      new Date().toISOString()
    ).run();
  } catch {
    // Logging must never break the main request.
  }
}

function deviceCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let value = "";
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  for (const byte of bytes) value += alphabet[byte % alphabet.length];
  return `${value.slice(0, 4)}-${value.slice(4)}`;
}

function normalizeDeviceCode(value) {
  return String(value || "").trim().toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 16);
}

function bridgeLinkPage(title, message, success) {
  const accent = success ? "#7cff9b" : "#ff638a";
  return new Response(`<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Integro Bridge</title>
  <style>
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #070807; color: #f7fbf3; font-family: Inter, system-ui, sans-serif; }
    main { width: min(520px, calc(100vw - 32px)); border: 2px solid #e7f4e4; background: #111411; padding: 28px; box-shadow: 8px 8px 0 #e7f4e4; }
    h1 { margin: 0 0 12px; font-size: 34px; }
    p { margin: 0; color: #aeb8ad; font-weight: 800; line-height: 1.45; }
    b { display: inline-grid; place-items: center; width: 42px; height: 42px; margin-bottom: 18px; border: 2px solid ${accent}; color: ${accent}; }
  </style>
</head>
<body>
  <main>
    <b>${success ? "OK" : "!"}</b>
    <h1>${escapeHtml(title)}</h1>
    <p>${escapeHtml(message)}</p>
  </main>
</body>
</html>`, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function sanitizeCommandPart(value) {
  return String(value || "")
    .replace(/[^\w.@-]/g, "_")
    .slice(0, 64);
}

function bridgeFetch(env, path, init = {}) {
  const id = env.BRIDGE_ROOM.idFromName("minecraft-primary");
  const target = `https://bridge${path}`;
  if (init instanceof Request) {
    return env.BRIDGE_ROOM.get(id).fetch(new Request(target, init));
  }
  return env.BRIDGE_ROOM.get(id).fetch(target, init);
}

function mapActions(rows, includeCommand = false) {
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    price: row.price,
    sentiment: normalizeSentiment(row.sentiment),
    cooldownSeconds: row.cooldown_seconds,
    commandMode: row.command_mode || "sequence",
    stepDelayMs: row.step_delay_ms || 0,
    randomCount: row.random_count || 1,
    bannerUrl: row.banner_url,
    commandCount: parseCommandPlan(row.command_plan, row.command).length,
    isEnabled: Boolean(row.is_enabled),
    ...(includeCommand ? {
      command: row.command,
      commands: parseCommandPlan(row.command_plan, row.command)
    } : {})
  }));
}

function mapVouchers(rows) {
  return rows.map((row) => ({
    id: row.id,
    code: row.code,
    coins: row.coins,
    maxRedemptions: row.max_redemptions,
    redeemedCount: row.redeemed_count,
    perUserLimit: row.per_user_limit || 1,
    perUserCooldownSeconds: row.per_user_cooldown_seconds || 0,
    expiresAt: row.expires_at,
    isActive: Boolean(row.is_active),
    isUsed: row.redeemed_count >= row.max_redemptions,
    canDelete: true,
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
    commandSummary: commandSummary(row.command_snapshot),
    createdAt: row.created_at,
    completedAt: row.completed_at,
    errorMessage: row.error_message,
    userEmail: row.user_email,
    userName: row.user_name
  }));
}

function commandSummary(snapshot) {
  try {
    const steps = JSON.parse(snapshot || "[]");
    if (Array.isArray(steps)) {
      return steps.map((step) => step.command).filter(Boolean).join(" -> ");
    }
  } catch {
    // Older rows contain plain commands.
  }
  return snapshot || "";
}

export { BridgeRoom };
export default app;
