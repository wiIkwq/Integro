import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { fail } from "./response.js";

const SESSION_DAYS = 30;

function bytesToHex(buffer) {
  return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function randomToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes)).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

export async function sha256Hex(value) {
  const encoded = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", encoded);
  return bytesToHex(hash);
}

function cookieOptions(c) {
  const sameSite = c.env.COOKIE_SAMESITE || "None";
  const secure = sameSite === "None" || new URL(c.req.url).protocol === "https:";
  return {
    httpOnly: true,
    secure,
    sameSite,
    path: "/"
  };
}

export function adminEmails(env) {
  return String(env.ADMIN_GOOGLE_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(env, email) {
  return adminEmails(env).includes(String(email || "").toLowerCase());
}

export async function createSession(c, userId) {
  const token = randomToken();
  const tokenHash = await sha256Hex(token);
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86400000).toISOString();
  await c.env.DB.prepare(
    "INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)"
  ).bind(tokenHash, userId, expiresAt).run();
  setCookie(c, "integro_session", token, {
    ...cookieOptions(c),
    maxAge: SESSION_DAYS * 86400
  });
}

export async function clearSession(c) {
  const token = getCookie(c, "integro_session");
  if (token) {
    const tokenHash = await sha256Hex(token);
    await c.env.DB.prepare("DELETE FROM sessions WHERE token_hash = ?").bind(tokenHash).run();
  }
  deleteCookie(c, "integro_session", { path: "/" });
}

export async function currentUser(c) {
  const token = getCookie(c, "integro_session");
  if (!token) return null;
  const tokenHash = await sha256Hex(token);
  const row = await c.env.DB.prepare(
    `SELECT users.id, users.email, users.name, users.avatar_url, users.role, users.balance
     FROM sessions
     JOIN users ON users.id = sessions.user_id
     WHERE sessions.token_hash = ? AND sessions.expires_at > datetime('now')`
  ).bind(tokenHash).first();
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    avatarUrl: row.avatar_url,
    role: row.role,
    balance: row.balance
  };
}

export async function requireUser(c, next) {
  const user = await currentUser(c);
  if (!user) return fail("Authentication required", "auth_required", 401);
  c.set("user", user);
  await next();
}

export async function requireAdmin(c, next) {
  const user = await currentUser(c);
  if (!user) return fail("Authentication required", "auth_required", 401);
  if (user.role !== "admin") return fail("Admin access required", "forbidden", 403);
  c.set("user", user);
  await next();
}

export function publicUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl || user.avatar_url,
    role: user.role,
    balance: user.balance
  };
}

export function safeReturnTo(env, value) {
  const fallback = env.WEB_ORIGIN || "/";
  if (!value) return fallback;
  try {
    const url = new URL(value, fallback);
    const allowedOrigins = [
      fallback,
      env.API_ORIGIN,
      ...String(env.LEGACY_WEB_ORIGINS || "").split(",").map((item) => item.trim())
    ]
      .filter(Boolean)
      .map((origin) => new URL(origin).origin);
    if (allowedOrigins.includes(url.origin)) return url.toString();
  } catch {
    return fallback;
  }
  return fallback;
}

export function setOauthStateCookie(c, state, returnTo) {
  setCookie(c, "integro_oauth_state", JSON.stringify({ state, returnTo }), {
    ...cookieOptions(c),
    maxAge: 600
  });
}

export function readOauthStateCookie(c) {
  const raw = getCookie(c, "integro_oauth_state");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearOauthStateCookie(c) {
  deleteCookie(c, "integro_oauth_state", { path: "/" });
}
