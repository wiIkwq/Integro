const API_BASE = "https://integro.bohdan.lol";
const POLL_TIMEOUT_MS = 10 * 60 * 1000;

async function api(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
  const payload = await response.json().catch(() => ({ ok: false, error: { message: "Bad API response" } }));
  if (!response.ok || payload.ok === false) {
    throw new Error(payload?.error?.message || "Request failed");
  }
  return payload.data;
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
  await Promise.allSettled(tabs.map((tab) => chrome.tabs.sendMessage(tab.id, message)));
}

async function claimWebsiteSession() {
  if (!chrome.cookies?.get) return null;
  const cookie = await chrome.cookies.get({ url: API_BASE, name: "integro_session" });
  if (!cookie?.value) return null;

  const data = await api("/extension/session/claim", {
    method: "POST",
    body: JSON.stringify({
      name: "YouTube commands",
      sessionToken: cookie.value
    })
  });

  await chrome.storage.local.set({ integroToken: data.token, integroUser: data.user || null });
  await broadcast({ type: "integro-auth-ready", user: data.user || null });
  return { ok: true, user: data.user || null, claimed: true };
}

async function startLogin() {
  const claimed = await claimWebsiteSession().catch(() => null);
  if (claimed) return claimed;

  const started = await api("/extension/device/start", {
    method: "POST",
    body: JSON.stringify({ name: "YouTube overlay" })
  });

  await chrome.tabs.create({ url: started.loginUrl, active: true });
  await broadcast({ type: "integro-auth-pending", code: started.code });

  const startedAt = Date.now();
  while (Date.now() - startedAt < POLL_TIMEOUT_MS) {
    await wait(started.pollAfterMs || 2500);
    const polled = await api(`/extension/device/poll?code=${encodeURIComponent(started.code)}`);
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
    await chrome.storage.local.remove(["integroToken", "integroUser"]);
    return { ok: true, user: null, expired: true };
  }
}

async function actions() {
  return authedApi("/extension/actions");
}

async function purchase(actionId) {
  return authedApi(`/extension/actions/${encodeURIComponent(actionId)}/purchase`, { method: "POST" });
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
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
