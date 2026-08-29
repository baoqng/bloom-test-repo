// bloom-deps:

export function computeExpiryTimestamp(issuedAt: unknown, ttlSeconds: unknown): number {
  if (typeof issuedAt !== 'number' || !Number.isFinite(issuedAt)) {
    throw new TypeError('issuedAt must be a finite number');
  }

  if (
    typeof ttlSeconds !== 'number' ||
    !Number.isFinite(ttlSeconds) ||
    !Number.isInteger(ttlSeconds) ||
    ttlSeconds <= 0
  ) {
    throw new TypeError('ttlSeconds must be a positive integer');
  }

  if (issuedAt < 0 || !Number.isInteger(issuedAt)) {
    throw new RangeError('issuedAt must be a non-negative integer');
  }

  const result = Math.trunc(issuedAt) + ttlSeconds;

  if (result > Number.MAX_SAFE_INTEGER) {
    throw new RangeError('Expiry timestamp overflows safe integer range');
  }

  return result;
}