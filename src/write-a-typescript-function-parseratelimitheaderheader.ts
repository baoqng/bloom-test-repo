// bloom-deps:

export function parseRateLimitHeader(header: string): { limit: number; remaining: number; resetAt: Date } {
  if (typeof header !== 'string') {
    throw new TypeError('header must be a string');
  }

  const fields: Record<string, string> = {};

  const parts = header.split(',');
  for (const part of parts) {
    const trimmedPart = part.trim();
    const eqIndex = trimmedPart.indexOf('=');
    if (eqIndex === -1) continue;
    const key = trimmedPart.slice(0, eqIndex).trim();
    const value = trimmedPart.slice(eqIndex + 1).trim();
    fields[key] = value;
  }

  if (!('limit' in fields) || !('remaining' in fields) || !('reset' in fields)) {
    throw new TypeError('header must contain limit, remaining, and reset fields');
  }

  const limitRaw = fields['limit'];
  const remainingRaw = fields['remaining'];
  const resetRaw = fields['reset'];

  const limitNum = Number(limitRaw);
  const remainingNum = Number(remainingRaw);
  const resetNum = Number(resetRaw);

  if (!Number.isFinite(limitNum) || !Number.isInteger(limitNum)) {
    throw new RangeError('limit must be a valid integer');
  }
  if (!Number.isFinite(remainingNum) || !Number.isInteger(remainingNum)) {
    throw new RangeError('remaining must be a valid integer');
  }
  if (!Number.isFinite(resetNum)) {
    throw new RangeError('reset must be a valid number');
  }

  if (limitNum < 1) {
    throw new RangeError('limit must be at least 1');
  }
  if (remainingNum < 0) {
    throw new RangeError('remaining must be at least 0');
  }
  if (remainingNum > limitNum) {
    throw new RangeError('remaining must not exceed limit');
  }

  const resetAt = new Date(resetNum * 1000);
  const now = Date.now();

  if (resetAt.getTime() <= now) {
    throw new RangeError('reset must be in the future');
  }

  return {
    limit: limitNum,
    remaining: remainingNum,
    resetAt,
  };
}