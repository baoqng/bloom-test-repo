// bloom-deps:

export function resolveNestedKey(obj: unknown, path: unknown): unknown {
  if (typeof path !== 'string' || path === '') {
    throw new TypeError('path must be a non-empty string');
  }

  if (obj === null || typeof obj !== 'object') {
    throw new TypeError('obj must be a non-null object');
  }

  const segments = path.split('.');

  for (const segment of segments) {
    if (segment === '') {
      throw new RangeError('path must not contain empty segments (consecutive dots, leading or trailing dots)');
    }
  }

  let current: unknown = obj;

  for (const segment of segments) {
    if (current === null || typeof current !== 'object') {
      return undefined;
    }
    const record = current as Record<string, unknown>;
    if (!Object.prototype.hasOwnProperty.call(record, segment) && !(segment in record)) {
      return undefined;
    }
    current = record[segment];
  }

  return current;
}