// bloom-deps:

class ServiceError extends Error {
  constructor(message: string, options?: { cause?: Error }) {
    super(message);
    this.name = 'ServiceError';
    if (options?.cause) {
      this.cause = options.cause;
    }
  }
}

function buildMetricTags(tags: unknown): string[] {
  // Validate that tags is a plain object
  if (
    tags === null ||
    typeof tags !== 'object' ||
    Array.isArray(tags) ||
    Object.getPrototypeOf(tags) !== Object.prototype
  ) {
    throw new TypeError('tags must be a plain object');
  }

  const entries: Array<[string, string]> = [];

  for (const [key, value] of Object.entries(tags)) {
    // Validate key type
    if (typeof key !== 'string') {
      throw new TypeError('all keys must be non-empty strings');
    }

    // Validate key is not empty
    if (key.length === 0) {
      throw new TypeError('all keys must be non-empty strings');
    }

    // Validate key is not empty after trimming
    const trimmedKey = key.trim();
    if (trimmedKey.length === 0) {
      throw new RangeError('key is empty after trimming');
    }

    // Validate key does not contain colon
    if (key.includes(':')) {
      throw new RangeError('key contains a colon character');
    }

    // Validate key does not contain whitespace
    if (/\s/.test(key)) {
      throw new RangeError('key contains a whitespace character');
    }

    // Validate value type and convert to string
    let stringValue: string;

    if (typeof value === 'string') {
      stringValue = value;
    } else if (typeof value === 'number') {
      // Check if number is finite
      if (!Number.isFinite(value)) {
        throw new RangeError('numeric value is not finite');
      }
      stringValue = String(value);
    } else if (typeof value === 'boolean') {
      stringValue = value ? 'true' : 'false';
    } else {
      throw new TypeError('all values must be string, number, or boolean');
    }

    entries.push([key, stringValue]);
  }

  // Sort lexicographically by key
  entries.sort((a, b) => a[0].localeCompare(b[0]));

  // Convert to tag strings
  return entries.map(([key, value]) => `${key}:${value}`);
}

export { buildMetricTags, ServiceError };