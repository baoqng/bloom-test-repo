// bloom-deps:

function buildRateLimitHeaders(limit: unknown, remaining: unknown, resetAt: unknown): Record<string, string> {
  if (typeof limit !== 'number' || typeof remaining !== 'number' || typeof resetAt !== 'number') {
    throw new TypeError('All arguments must be numbers');
  }

  if (!Number.isFinite(limit) || !Number.isInteger(limit) || limit <= 0) {
    throw new RangeError('limit must be a positive integer');
  }

  if (!Number.isFinite(remaining) || remaining < 0) {
    throw new RangeError('remaining must be a non-negative finite number');
  }

  if (remaining > limit) {
    throw new RangeError('remaining must not exceed limit');
  }

  if (!Number.isFinite(resetAt) || resetAt <= 0) {
    throw new RangeError('resetAt must be a positive finite number');
  }

  return {
    'X-RateLimit-Limit': String(limit),
    'X-RateLimit-Remaining': String(remaining),
    'X-RateLimit-Reset': String(Math.ceil(resetAt)),
  };
}

export { buildRateLimitHeaders };