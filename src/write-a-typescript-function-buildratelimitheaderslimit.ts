// bloom-deps:

function buildRateLimitHeaders(
  limit: unknown,
  remaining: unknown,
  resetAt: unknown
): Record<string, string> {
  if (
    typeof limit !== 'number' ||
    !Number.isFinite(limit) ||
    !Number.isInteger(limit) ||
    limit <= 0
  ) {
    throw new TypeError('limit must be a positive integer');
  }

  if (
    typeof remaining !== 'number' ||
    !Number.isFinite(remaining) ||
    !Number.isInteger(remaining) ||
    remaining < 0
  ) {
    throw new TypeError('remaining must be a non-negative integer');
  }

  if (
    typeof resetAt !== 'number' ||
    !Number.isFinite(resetAt) ||
    !Number.isInteger(resetAt) ||
    resetAt <= 0
  ) {
    throw new TypeError('resetAt must be a positive integer');
  }

  if (remaining > limit) {
    throw new RangeError('remaining must not exceed limit');
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  const retryAfter = Math.max(0, resetAt - nowSeconds);

  return {
    'X-RateLimit-Limit': String(limit),
    'X-RateLimit-Remaining': String(remaining),
    'X-RateLimit-Reset': String(resetAt),
    'Retry-After': String(retryAfter),
  };
}

export { buildRateLimitHeaders };