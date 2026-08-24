// bloom-deps:

function extractRateLimitState(headers: unknown): { limit: number; remaining: number; resetAt: Date } {
  // Validate that headers is a plain object
  if (typeof headers !== 'object' || headers === null || Array.isArray(headers)) {
    throw new TypeError('headers must be a plain object');
  }

  const headersObj = headers as Record<string, unknown>;

  // Check that all three required headers are present
  if (!('x-ratelimit-limit' in headersObj)) {
    throw new TypeError('x-ratelimit-limit header is missing');
  }
  if (!('x-ratelimit-remaining' in headersObj)) {
    throw new TypeError('x-ratelimit-remaining header is missing');
  }
  if (!('x-ratelimit-reset' in headersObj)) {
    throw new TypeError('x-ratelimit-reset header is missing');
  }

  const limitValue = headersObj['x-ratelimit-limit'];
  const remainingValue = headersObj['x-ratelimit-remaining'];
  const resetValue = headersObj['x-ratelimit-reset'];

  // Validate that all three values are strings
  if (typeof limitValue !== 'string') {
    throw new TypeError('x-ratelimit-limit must be a string');
  }
  if (typeof remainingValue !== 'string') {
    throw new TypeError('x-ratelimit-remaining must be a string');
  }
  if (typeof resetValue !== 'string') {
    throw new TypeError('x-ratelimit-reset must be a string');
  }

  // Parse x-ratelimit-limit
  const limit = parseInt(limitValue, 10);
  if (isNaN(limit)) {
    throw new RangeError('x-ratelimit-limit cannot be parsed as an integer');
  }
  if (limit < 0) {
    throw new RangeError('x-ratelimit-limit must be non-negative');
  }

  // Parse x-ratelimit-remaining
  const remaining = parseInt(remainingValue, 10);
  if (isNaN(remaining)) {
    throw new RangeError('x-ratelimit-remaining cannot be parsed as an integer');
  }
  if (remaining < 0) {
    throw new RangeError('x-ratelimit-remaining must be non-negative');
  }

  // Parse x-ratelimit-reset
  const resetSeconds = parseInt(resetValue, 10);
  if (isNaN(resetSeconds)) {
    throw new RangeError('x-ratelimit-reset cannot be parsed as an integer');
  }
  if (resetSeconds <= 0) {
    throw new RangeError('x-ratelimit-reset must be a positive integer');
  }

  return {
    limit,
    remaining,
    resetAt: new Date(resetSeconds * 1000),
  };
}

export { extractRateLimitState };