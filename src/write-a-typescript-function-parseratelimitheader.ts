// bloom-deps:

export function parseRateLimit(header: unknown): { limit: number; remaining: number; reset: number } {
  if (typeof header !== 'string' || header.length === 0) {
    throw new TypeError('header must be a non-empty string');
  }

  const fields: Record<string, number> = {};
  const parts = header.split(',');

  for (const part of parts) {
    const eqIndex = part.indexOf('=');
    if (eqIndex === -1) continue;

    const key = part.slice(0, eqIndex).trim();
    const valueStr = part.slice(eqIndex + 1).trim();

    if (key === 'limit' || key === 'remaining' || key === 'reset') {
      const parsed = Number(valueStr);
      if (!Number.isInteger(parsed) || valueStr === '' || isNaN(parsed)) {
        throw new RangeError(`Field '${key}' cannot be parsed as an integer: '${valueStr}'`);
      }
      if (parsed < 0) {
        throw new RangeError(`Field '${key}' must not be negative: ${parsed}`);
      }
      fields[key] = parsed;
    }
  }

  if (!('limit' in fields)) {
    throw new RangeError("Missing required field: 'limit'");
  }
  if (!('remaining' in fields)) {
    throw new RangeError("Missing required field: 'remaining'");
  }
  if (!('reset' in fields)) {
    throw new RangeError("Missing required field: 'reset'");
  }

  return {
    limit: fields['limit'],
    remaining: fields['remaining'],
    reset: fields['reset'],
  };
}