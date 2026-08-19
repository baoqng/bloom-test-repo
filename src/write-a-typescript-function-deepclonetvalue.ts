// bloom-deps:

function deepClone<T>(value: T, seen: WeakSet<object> = new WeakSet()): T {
  if (value === null || value === undefined) {
    return value;
  }

  const type = typeof value;

  if (type === 'string' || type === 'number' || type === 'boolean') {
    return value;
  }

  if (type === 'function') {
    throw new TypeError('deepClone does not support functions');
  }

  if (type === 'object') {
    if (value instanceof Date) {
      throw new TypeError('deepClone does not support Date objects');
    }

    if (value instanceof RegExp) {
      throw new TypeError('deepClone does not support RegExp objects');
    }

    if (value instanceof Map) {
      throw new TypeError('deepClone does not support Map objects');
    }

    if (value instanceof Set) {
      throw new TypeError('deepClone does not support Set objects');
    }

    if (Array.isArray(value)) {
      if (seen.has(value as unknown as object)) {
        throw new TypeError('deepClone does not support circular references');
      }
      seen.add(value as unknown as object);
      const clonedArray = (value as unknown as unknown[]).map((item) =>
        deepClone(item, seen)
      );
      seen.delete(value as unknown as object);
      return clonedArray as unknown as T;
    }

    const obj = value as Record<string, unknown>;

    if (seen.has(obj)) {
      throw new TypeError('deepClone does not support circular references');
    }
    seen.add(obj);

    const cloned: Record<string, unknown> = {};
    for (const key of Object.keys(obj)) {
      cloned[key] = deepClone(obj[key], seen);
    }

    seen.delete(obj);
    return cloned as unknown as T;
  }

  throw new TypeError(`deepClone does not support type: ${type}`);
}

export { deepClone };