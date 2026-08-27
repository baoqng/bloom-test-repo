// bloom-deps:

function computeExpiryTimestamp(issuedAtMs: unknown, ttlSeconds: unknown): number {
  if (typeof issuedAtMs !== 'number') {
    throw new TypeError('issuedAtMs must be a number');
  }
  if (typeof ttlSeconds !== 'number') {
    throw new TypeError('ttlSeconds must be a number');
  }
  if (!Number.isFinite(issuedAtMs) || !Number.isInteger(issuedAtMs) || issuedAtMs <= 0) {
    throw new RangeError('issuedAtMs must be a positive finite integer');
  }
  if (!Number.isFinite(ttlSeconds) || !Number.isInteger(ttlSeconds) || ttlSeconds <= 0) {
    throw new RangeError('ttlSeconds must be a positive finite integer');
  }
  if (ttlSeconds > 31536000) {
    throw new RangeError('ttlSeconds must not exceed 31536000');
  }
  const issuedAtSeconds = Math.floor(issuedAtMs / 1000);
  const expiry = issuedAtSeconds + ttlSeconds;
  return expiry;
}

export { computeExpiryTimestamp };