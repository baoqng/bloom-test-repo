// bloom-deps:

export function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object') return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

export function mergeHeaders(base: unknown, overrides: unknown): Record<string, string> {
  if (!isPlainObject(base)) {
    throw new TypeError('base must be a plain non-null object');
  }
  if (!isPlainObject(overrides)) {
    throw new TypeError('overrides must be a plain non-null object');
  }

  const result: Record<string, string> = {};

  for (const key of Object.keys(base)) {
    const value = base[key];
    if (typeof value !== 'string') {
      throw new TypeError(`Value for header "${key}" in base must be a string`);
    }
    result[key.toLowerCase()] = value;
  }

  for (const key of Object.keys(overrides)) {
    const value = overrides[key];
    if (typeof value !== 'string') {
      throw new TypeError(`Value for header "${key}" in overrides must be a string`);
    }
    result[key.toLowerCase()] = value;
  }

  return result;
}