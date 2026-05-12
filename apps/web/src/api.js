const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8787";

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
  adminUsers: () => request("/admin/users"),
  adminPurchases: () => request("/admin/purchases")
};
