// bloom-deps:

export function parseRateLimit(header: unknown): { limit: number; remaining: number; reset: number } {
  if (typeof header !== 'string' || header === '') {
    throw new TypeError('header must be a non-empty string');
  }

  const parts = header.split(',');
  const fields: Record<string, number> = {};

  for (const part of parts) {
    const trimmed = part.trim();
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;

    const key = trimmed.slice(0, eqIndex).trim();
    const rawValue = trimmed.slice(eqIndex + 1).trim();

    if (key === 'limit' || key === 'remaining' || key === 'reset') {
      if (rawValue === '' || !/^-?\d+$/.test(rawValue)) {
        throw new RangeError(`field '${key}' cannot be parsed as an integer`);
      }
      const num = parseInt(rawValue, 10);
      if (!Number.isInteger(num)) {
        throw new RangeError(`field '${key}' cannot be parsed as an integer`);
      }
      if (num < 0) {
        throw new RangeError(`field '${key}' must not be negative`);
      }
      fields[key] = num;
    }
  }

  if (!('limit' in fields)) {
    throw new RangeError("missing required field 'limit'");
  }
  if (!('remaining' in fields)) {
    throw new RangeError("missing required field 'remaining'");
  }
  if (!('reset' in fields)) {
    throw new RangeError("missing required field 'reset'");
  }

  return {
    limit: fields['limit'],
    remaining: fields['remaining'],
    reset: fields['reset'],
  };
}