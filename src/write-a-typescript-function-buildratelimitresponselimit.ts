// bloom-deps:

function buildRateLimitResponse(
  limit: unknown,
  remaining: unknown,
  resetAt: unknown,
  retryAfter?: unknown
): Record<string, string> {
  // Type checks
  if (typeof limit !== 'number') {
    throw new TypeError('limit must be a number');
  }
  if (typeof remaining !== 'number') {
    throw new TypeError('remaining must be a number');
  }
  if (typeof resetAt !== 'number') {
    throw new TypeError('resetAt must be a number');
  }

  // Range checks for limit
  if (!Number.isFinite(limit) || !Number.isInteger(limit) || limit <= 0) {
    throw new RangeError('limit must be a positive integer');
  }

  // Range checks for remaining
  if (!Number.isFinite(remaining) || !Number.isInteger(remaining) || remaining < 0) {
    throw new RangeError('remaining must be a non-negative integer');
  }

  // remaining vs limit
  if (remaining > limit) {
    throw new RangeError('remaining must not exceed limit');
  }

  // Range checks for resetAt
  if (!Number.isFinite(resetAt) || !Number.isInteger(resetAt) || resetAt <= 0) {
    throw new RangeError('resetAt must be a positive integer');
  }

  // retryAfter validation
  if (retryAfter !== undefined) {
    if (typeof retryAfter !== 'number') {
      throw new TypeError('retryAfter must be a number');
    }
    if (!Number.isFinite(retryAfter) || !Number.isInteger(retryAfter) || retryAfter <= 0) {
      throw new RangeError('retryAfter must be a positive integer');
    }
  }

  // Build headers
  const headers: Record<string, string> = {
    'X-RateLimit-Limit': limit.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': resetAt.toString(),
  };

  if (retryAfter !== undefined) {
    headers['Retry-After'] = (retryAfter as number).toString();
  }

  return headers;
}

export { buildRateLimitResponse };