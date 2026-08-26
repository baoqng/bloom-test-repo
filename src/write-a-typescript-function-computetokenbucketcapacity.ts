// bloom-deps:

function computeTokenBucket(
  capacity: unknown,
  refillRatePerMs: unknown,
  lastRefillAt: unknown,
  currentTokens: unknown,
  now: unknown
): number {
  if (typeof capacity !== 'number') throw new TypeError('capacity must be a number');
  if (typeof refillRatePerMs !== 'number') throw new TypeError('refillRatePerMs must be a number');
  if (typeof lastRefillAt !== 'number') throw new TypeError('lastRefillAt must be a number');
  if (typeof currentTokens !== 'number') throw new TypeError('currentTokens must be a number');
  if (typeof now !== 'number') throw new TypeError('now must be a number');

  if (!Number.isFinite(capacity) || capacity <= 0) {
    throw new RangeError('capacity must be a positive finite number');
  }
  if (!Number.isFinite(refillRatePerMs) || refillRatePerMs <= 0) {
    throw new RangeError('refillRatePerMs must be a positive finite number');
  }
  if (!Number.isFinite(lastRefillAt) || lastRefillAt < 0) {
    throw new RangeError('lastRefillAt must be a non-negative number');
  }
  if (!Number.isFinite(currentTokens) || currentTokens < 0) {
    throw new RangeError('currentTokens must be a non-negative number');
  }
  if (!Number.isFinite(now) || now < lastRefillAt) {
    throw new RangeError('now must be greater than or equal to lastRefillAt');
  }

  return Math.min(capacity, currentTokens + (now - lastRefillAt) * refillRatePerMs);
}

export { computeTokenBucket };