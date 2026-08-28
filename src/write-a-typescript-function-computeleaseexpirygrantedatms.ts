// bloom-deps:

export function computeLeaseExpiry(
  grantedAtMs: unknown,
  durationMs: unknown
): { expiresAtMs: number; isExpired: boolean; remainingMs: number } {
  if (
    typeof grantedAtMs !== 'number' ||
    !Number.isFinite(grantedAtMs) ||
    !Number.isInteger(grantedAtMs) ||
    grantedAtMs < 0
  ) {
    throw new TypeError('grantedAtMs must be a non-negative integer');
  }

  if (
    typeof durationMs !== 'number' ||
    !Number.isFinite(durationMs) ||
    !Number.isInteger(durationMs) ||
    durationMs <= 0
  ) {
    throw new TypeError('durationMs must be a positive integer');
  }

  const expiresAtMs = grantedAtMs + durationMs;
  const remainingMs = Math.max(0, expiresAtMs - Date.now());
  const isExpired = remainingMs === 0;

  return { expiresAtMs, isExpired, remainingMs };
}