// bloom-deps:

export function parseRateLimitHeader(header: string): { limit: number; remaining: number; resetAt: Date } {
  if (typeof header !== 'string') {
    throw new TypeError('header must be a string');
  }

  if (header.length === 0 || header.length > 1000) {
    throw new TypeError('header string is invalid');
  }

  const limitMatch = header.match(/\blimit\s*=\s*(-?\d+)/i);
  const remainingMatch = header.match(/\bremaining\s*=\s*(-?\d+)/i);
  const resetMatch = header.match(/\breset\s*=\s*(-?\d+)/i);

  if (!limitMatch || !remainingMatch || !resetMatch) {
    throw new TypeError('header is missing one or more required fields: limit, remaining, reset');
  }

  const limit = parseInt(limitMatch[1], 10);
  const remaining = parseInt(remainingMatch[1], 10);
  const resetTimestamp = parseInt(resetMatch[1], 10);

  if (limit < 1) {
    throw new RangeError('limit must be at least 1');
  }

  if (remaining < 0) {
    throw new RangeError('remaining must be at least 0');
  }

  if (remaining > limit) {
    throw new RangeError('remaining must not exceed limit');
  }

  const resetAt = new Date(resetTimestamp * 1000);
  const now = new Date();

  if (resetAt <= now) {
    throw new RangeError('reset timestamp must be in the future');
  }

  return { limit, remaining, resetAt };
}