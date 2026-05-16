const LOCAL_API_BASE = "http://localhost:8787";
const LEGACY_API_BASE = "https://integro-api.bogdan3000tm1331.workers.dev";

function defaultApiBase() {
  if (typeof window === "undefined") return LOCAL_API_BASE;
  const localHosts = new Set(["localhost", "127.0.0.1", "::1"]);
  if (localHosts.has(window.location.hostname)) return LOCAL_API_BASE;
  if (window.location.hostname.endsWith(".pages.dev")) return LEGACY_API_BASE;
  return "";
}

const API_BASE = import.meta.env.VITE_API_BASE || defaultApiBase();

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : { ok: false, error: { message: await response.text() } };

  if (!response.ok || payload.ok === false) {
    const message = payload?.error?.message || "Request failed";
    throw new Error(message);
  }

  return payload.data;
}

export const api = {
  base: API_BASE,
  loginUrl() {
    const returnTo = encodeURIComponent(window.location.origin);
    return `${API_BASE}/auth/google/start?returnTo=${returnTo}`;
  },
  twitchLoginUrl() {
    const returnTo = encodeURIComponent(window.location.origin);
    return `${API_BASE}/auth/twitch/start?returnTo=${returnTo}`;
  },
  me: () => request("/me"),
  logout: () => request("/auth/logout", { method: "POST" }),
  actions: () => request("/actions"),
  buyAction: (id) => request(`/actions/${id}/purchase`, { method: "POST" }),
  redeemVoucher: (code) =>
    request("/vouchers/redeem", {
      method: "POST",
      body: JSON.stringify({ code })
    }),
  transactions: () => request("/me/transactions"),
  purchases: () => request("/me/purchases"),
  stats: () => request("/me/stats"),
  adminOverview: () => request("/admin/overview"),
  adminActions: () => request("/admin/actions"),
  createAction: (body) =>
    request("/admin/actions", { method: "POST", body: JSON.stringify(body) }),
  updateAction: (id, body) =>
    request(`/admin/actions/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  deleteAction: (id) => request(`/admin/actions/${id}`, { method: "DELETE" }),
  adminVouchers: () => request("/admin/vouchers"),
  createVoucher: (body) =>
    request("/admin/vouchers", { method: "POST", body: JSON.stringify(body) }),
  updateVoucher: (id, body) =>
    request(`/admin/vouchers/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  deleteVoucher: (id) => request(`/admin/vouchers/${id}`, { method: "DELETE" }),
  adminUsers: () => request("/admin/users"),
  adminPurchases: () => request("/admin/purchases"),
  adminResetData: () => request("/admin/reset", { method: "POST" }),
  flushBridge: () => request("/bridge/flush", { method: "POST" }),
  developerUsers: () => request("/developer/users"),
  updateUserRole: (id, role) =>
    request(`/developer/users/${id}/role`, { method: "PATCH", body: JSON.stringify({ role }) }),
  adjustUserBalance: (id, body) =>
    request(`/developer/users/${id}/balance`, { method: "POST", body: JSON.stringify(body) }),
  bridgeDevices: () => request("/developer/bridge-devices"),
  revokeBridgeDevice: (id) => request(`/developer/bridge-devices/${id}`, { method: "DELETE" })
};
