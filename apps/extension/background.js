const API_BASE = "https://integro.bohdan.lol";
const POLL_TIMEOUT_MS = 10 * 60 * 1000;
const API_TIMEOUT_MS = 12000;
const DEBUG = true;

function log(level, message, data) {
  if (!DEBUG) return;
  const method = level === "error" ? "error" : level === "warn" ? "warn" : "log";
  console[method](`[Integro extension:bg] ${message}`, data || "");
}

async function api(path, options = {}) {
  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => controller.abort(), options.timeoutMs || API_TIMEOUT_MS);
  const { timeoutMs, ...fetchOptions } = options;

  try {
    log("log", "API request", { path, method: fetchOptions.method || "GET" });
    const response = await fetch(`${API_BASE}${path}`, {
      ...fetchOptions,
      signal: fetchOptions.signal || controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(fetchOptions.headers || {})
      }
    });
    const payload = await response.json().catch(() => ({ ok: false, error: { message: "Bad API response" } }));
    if (!response.ok || payload.ok === false) {
      log("warn", "API failed", { path, status: response.status, payload });
      throw new Error(payload?.error?.message || "Request failed");
    }
    log("log", "API ok", { path });
    return payload.data;
  } catch (error) {
    if (error?.name === "AbortError") {
      log("warn", "API timeout", { path });
      throw new Error("Integro API не ответил вовремя");
    }
    log("error", "API error", { path, error: error.message });
    throw error;
  } finally {
    globalThis.clearTimeout(timeout);
  }
}

async function authedApi(path, options = {}) {
  const { integroToken } = await chrome.storage.local.get(["integroToken"]);
  if (!integroToken) throw new Error("Нужно войти в Integro");
  return api(path, {
    ...options,
    headers: {
      Authorization: `Bearer ${integroToken}`,
      ...(options.headers || {})
    }
  });
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function broadcast(message) {
  const tabs = await chrome.tabs.query({ url: ["https://www.youtube.com/*", "https://youtube.com/*"] });
  log("log", "Broadcast", { message, tabs: tabs.length });
  await Promise.allSettled(tabs.map((tab) => chrome.tabs.sendMessage(tab.id, message)));
}

async function claimWebsiteSession() {
  log("log", "Claim website session started");
  if (!chrome.cookies?.get) return null;
  const cookie = await chrome.cookies.get({ url: API_BASE, name: "integro_session" });
  if (!cookie?.value) {
    log("warn", "No website session cookie");
    return null;
  }

  const data = await api("/extension/session/claim", {
    method: "POST",
    body: JSON.stringify({
      name: "YouTube commands",
      sessionToken: cookie.value
    })
  });

  await chrome.storage.local.set({ integroToken: data.token, integroUser: data.user || null });
  await broadcast({ type: "integro-auth-ready", user: data.user || null });
  log("log", "Website session claimed", { user: data.user?.id });
  return { ok: true, user: data.user || null, claimed: true };
}

async function startLogin() {
  log("log", "Start login");
  const claimed = await claimWebsiteSession().catch(() => null);
  if (claimed) return claimed;

  const started = await api("/extension/device/start", {
    method: "POST",
    body: JSON.stringify({ name: "YouTube overlay" })
  });

  await chrome.tabs.create({ url: started.loginUrl, active: true });
  await broadcast({ type: "integro-auth-pending", code: started.code });
  log("log", "Device login opened", { code: started.code });

  const startedAt = Date.now();
  while (Date.now() - startedAt < POLL_TIMEOUT_MS) {
    await wait(started.pollAfterMs || 2500);
    const polled = await api(`/extension/device/poll?code=${encodeURIComponent(started.code)}`);
    log("log", "Device poll", { status: polled.status });
    if (polled.status === "approved" && polled.token) {
      await chrome.storage.local.set({ integroToken: polled.token, integroUser: polled.user || null });
      await broadcast({ type: "integro-auth-ready", user: polled.user || null });
      return { ok: true, user: polled.user || null };
    }
    if (polled.status === "denied" || polled.status === "expired") {
      throw new Error(polled.reason || "Login expired");
    }
  }
  throw new Error("Login timeout");
}

async function logout() {
  log("log", "Logout");
  const { integroToken } = await chrome.storage.local.get(["integroToken"]);
  if (integroToken) {
    await fetch(`${API_BASE}/extension/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${integroToken}` }
    }).catch(() => null);
  }
  await chrome.storage.local.remove(["integroToken", "integroUser"]);
  await broadcast({ type: "integro-auth-logout" });
  return { ok: true };
}

async function session() {
  log("log", "Session check");
  const { integroToken, integroUser } = await chrome.storage.local.get(["integroToken", "integroUser"]);
  if (!integroToken) {
    const claimed = await claimWebsiteSession().catch(() => null);
    return claimed || { ok: true, user: null };
  }

  try {
    const data = await authedApi("/extension/me");
    await chrome.storage.local.set({ integroUser: data.user || null });
    return { ok: true, user: data.user || integroUser || null };
  } catch (error) {
    log("warn", "Stored extension token expired or invalid", { error: error.message });
    await chrome.storage.local.remove(["integroToken", "integroUser"]);
    return { ok: true, user: null, expired: true };
  }
}

async function actions() {
  log("log", "Load actions");
  return authedApi("/extension/actions");
}

async function purchase(actionId) {
  log("log", "Purchase action", { actionId });
  return authedApi(`/extension/actions/${encodeURIComponent(actionId)}/purchase`, { method: "POST" });
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  log("log", "Message received", { type: message?.type });
  if (message?.type === "integro-session") {
    session()
      .then((result) => sendResponse(result))
      .catch((error) => sendResponse({ ok: false, error: error.message }));
    return true;
  }

  if (message?.type === "integro-actions") {
    actions()
      .then((data) => sendResponse({ ok: true, data }))
      .catch((error) => sendResponse({ ok: false, error: error.message }));
    return true;
  }

  if (message?.type === "integro-purchase") {
    purchase(message.actionId)
      .then((data) => sendResponse({ ok: true, data }))
      .catch((error) => sendResponse({ ok: false, error: error.message }));
    return true;
  }

  if (message?.type === "integro-start-login") {
    startLogin()
      .then((result) => sendResponse(result))
      .catch((error) => sendResponse({ ok: false, error: error.message }));
    return true;
  }

  if (message?.type === "integro-logout") {
    logout()
      .then((result) => sendResponse(result))
      .catch((error) => sendResponse({ ok: false, error: error.message }));
    return true;
  }

  return false;
});
