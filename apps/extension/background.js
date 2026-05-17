const API_BASE = "https://integro.bohdan.lol";
const POLL_TIMEOUT_MS = 10 * 60 * 1000;

async function api(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });
  const payload = await response.json().catch(() => ({ ok: false, error: { message: "Bad API response" } }));
  if (!response.ok || payload.ok === false) {
    throw new Error(payload?.error?.message || "Request failed");
  }
  return payload.data;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function broadcast(message) {
  const tabs = await chrome.tabs.query({ url: ["https://www.youtube.com/*", "https://youtube.com/*"] });
  await Promise.allSettled(tabs.map((tab) => chrome.tabs.sendMessage(tab.id, message)));
}

async function startLogin() {
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

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
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
