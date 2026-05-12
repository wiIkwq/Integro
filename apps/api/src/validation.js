export function normalizeCode(code) {
  return String(code || "")
    .trim()
    .replace(/\s+/g, "")
    .toUpperCase();
}

export function requireString(value, label, min = 1, max = 240) {
  const next = String(value || "").trim();
  if (next.length < min) throw new Error(`${label} is required`);
  if (next.length > max) throw new Error(`${label} is too long`);
  return next;
}

export function requireInt(value, label, min = 0, max = 100000000) {
  const next = Number(value);
  if (!Number.isInteger(next) || next < min || next > max) {
    throw new Error(`${label} is invalid`);
  }
  return next;
}

export function optionalDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error("expiresAt is invalid");
  return date.toISOString();
}
