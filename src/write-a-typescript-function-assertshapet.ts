// bloom-deps:

class ServiceError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = 'ServiceError';
    if (options?.cause) {
      this.cause = options.cause;
    }
  }
}

function assertShape<T extends Record<string, unknown>>(
  value: unknown,
  requiredKeys: string[]
): asserts value is T {
  // Validate requiredKeys parameter
  if (!Array.isArray(requiredKeys)) {
    throw new TypeError('requiredKeys must be an array');
  }

  for (const key of requiredKeys) {
    if (typeof key !== 'string') {
      throw new TypeError('requiredKeys must be an array of strings');
    }
  }

  // Check for empty strings in requiredKeys
  for (const key of requiredKeys) {
    if (key.length === 0) {
      throw new RangeError('Required keys cannot be empty strings');
    }
  }

  // Validate value is a non-null object
  if (value === null || typeof value !== 'object') {
    throw new TypeError('Value must be a non-null object');
  }

  // Check that value is a plain object (has own properties, not just prototype)
  if (Array.isArray(value)) {
    throw new TypeError('Value must be a non-null object');
  }

  // Validate all required keys exist and are not undefined
  for (const key of requiredKeys) {
    if (!Object.prototype.hasOwnProperty.call(value, key)) {
      throw new RangeError(`Missing required field: ${key}`);
    }

    const recordValue = (value as Record<string, unknown>)[key];
    if (recordValue === undefined) {
      throw new RangeError(`Missing required field: ${key}`);
    }
  }
}

export { assertShape, ServiceError };