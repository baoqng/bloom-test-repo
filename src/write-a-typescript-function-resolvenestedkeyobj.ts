// bloom-deps:

function resolveNestedKey(obj: unknown, path: unknown): unknown {
  if (typeof path !== 'string') {
    throw new TypeError('path must be a string');
  }
  if (path === '') {
    throw new TypeError('path must be a non-empty string');
  }
  if (obj === null || typeof obj !== 'object') {
    throw new TypeError('obj must be a non-null object');
  }

  const segments: string[] = [];
  let remaining = path;
  while (true) {
    const idx = remaining.indexOf('.');
    if (idx === -1) {
      segments.push(remaining);
      break;
    }
    segments.push(remaining.slice(0, idx));
    remaining = remaining.slice(idx + 1);
  }

  for (const segment of segments) {
    if (segment === '') {
      throw new RangeError('path must not contain empty segments');
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

export { resolveNestedKey };