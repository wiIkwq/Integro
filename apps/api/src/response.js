export function ok(data = {}) {
  return { ok: true, data };
}

export function fail(message, code = "bad_request", status = 400) {
  return Response.json({ ok: false, error: { code, message } }, { status });
}
