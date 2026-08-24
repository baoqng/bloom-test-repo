// bloom-deps:

export class ServiceError extends Error {
  constructor(
    message: string,
    public context?: { cause?: unknown }
  ) {
    super(message);
    this.name = 'ServiceError';
  }
}

export function buildMetricTags(tags: unknown): string[] {
  // Validate input is a plain object
  if (
    tags === null ||
    typeof tags !== 'object' ||
    Array.isArray(tags) ||
    Object.getPrototypeOf(tags) !== Object.prototype
  ) {
    throw new TypeError('tags must be a plain object');
  }

  const entries = Object.entries(tags);
  const result: string[] = [];

  for (const [key, value] of entries) {
    // Validate key is a non-empty string
    if (typeof key !== 'string') {
      throw new TypeError('all keys must be strings');
    }

    const trimmedKey = key.trim();

    if (trimmedKey.length === 0) {
      throw new RangeError('key is empty after trimming');
    }

    // Check for whitespace in key
    if (/\s/.test(key)) {
      throw new RangeError('key contains whitespace character');
    }

    // Check for colon in key
    if (key.includes(':')) {
      throw new RangeError('key contains a colon character');
    }

    // Validate value type
    if (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean') {
      throw new TypeError('all values must be strings, numbers, or booleans');
    }

    // Handle numeric values
    let stringValue: string;
    if (typeof value === 'number') {
      if (!Number.isFinite(value)) {
        throw new RangeError('numeric value is not finite');
      }
      stringValue = String(value);
    } else if (typeof value === 'boolean') {
      stringValue = value ? 'true' : 'false';
    } else {
      stringValue = value;
    }

    result.push(`${key}:${stringValue}`);
  }

  // Sort lexicographically by key
  result.sort((a, b) => {
    const keyA = a.split(':')[0];
    const keyB = b.split(':')[0];
    return keyA.localeCompare(keyB);
  });

  return result;
}