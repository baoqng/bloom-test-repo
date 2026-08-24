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

function resolveNestedKey(obj: unknown, path: unknown): unknown {
  // Input validation guard
  if (typeof obj !== 'object' || obj === null) {
    throw new TypeError('obj must be a non-null object');
  }

  if (typeof path !== 'string') {
    throw new TypeError('path must be a string');
  }

  if (path.length === 0) {
    throw new TypeError('path must be a non-empty string');
  }

  // Check for empty segments (consecutive dots, leading dots, trailing dots)
  if (path.includes('..') || path.startsWith('.') || path.endsWith('.')) {
    throw new RangeError('path contains empty segments');
  }

  // Split the path and traverse
  const segments = path.split('.');

  let current: unknown = obj;

  for (const segment of segments) {
    // Double-check segment is not empty (defensive against edge cases)
    if (segment.length === 0) {
      throw new RangeError('path contains empty segments');
    }

    // If current is not an object or is null, we cannot access properties
    if (typeof current !== 'object' || current === null) {
      return undefined;
    }

    // Access the property
    current = (current as Record<string, unknown>)[segment];

    // If the key is absent, return undefined
    if (current === undefined) {
      return undefined;
    }
  }

  return current;
}

export { resolveNestedKey, ServiceError };