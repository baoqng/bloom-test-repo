// bloom-deps:

export function computeTokenExpiry(
  issuedAtMs: unknown,
  ttlSeconds: unknown
): { expiresAtMs: number; isExpired: boolean; remainingMs: number } {
  if (
    typeof issuedAtMs !== "number" ||
    !Number.isFinite(issuedAtMs) ||
    !Number.isInteger(issuedAtMs) ||
    issuedAtMs < 0
  ) {
    throw new TypeError("issuedAtMs must be a non-negative integer");
  }

  if (
    typeof ttlSeconds !== "number" ||
    !Number.isFinite(ttlSeconds) ||
    !Number.isInteger(ttlSeconds) ||
    ttlSeconds <= 0
  ) {
    throw new TypeError("ttlSeconds must be a positive integer");
  }

  const expiresAtMs = issuedAtMs + ttlSeconds * 1000;
  const remainingMs = Math.max(0, expiresAtMs - Date.now());
  const isExpired = remainingMs === 0;

  return { expiresAtMs, isExpired, remainingMs };
}