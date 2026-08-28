// bloom-deps:

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object') return false;
  let proto = Object.getPrototypeOf(value);
  while (proto !== null) {
    if (proto === Object.prototype) {
      // Walk the full chain: ensure Object.prototype is the top and direct proto check
      return Object.getPrototypeOf(value) === Object.prototype;
    }
    proto = Object.getPrototypeOf(proto);
  }
  // proto chain reaches null without hitting Object.prototype as direct proto
  return Object.getPrototypeOf(value) === null;
}

export function mergeDeep<T extends Record<string, unknown>>(
  target: unknown,
  ...sources: unknown[]
): T {
  if (!isPlainObject(target)) {
    throw new TypeError('target must be a plain object');
  }

  for (const source of sources) {
    if (!isPlainObject(source)) {
      throw new TypeError('All sources must be plain objects');
    }
  }

  const result: Record<string, unknown> = Object.assign({}, target);

  for (const source of sources) {
    if (!isPlainObject(source)) {
      throw new TypeError('All sources must be plain objects');
    }
    for (const key of Object.keys(source)) {
      const sourceVal = source[key];
      const targetVal = result[key];

      if (isPlainObject(sourceVal) && isPlainObject(targetVal)) {
        result[key] = mergeDeep(targetVal, sourceVal);
      } else {
        result[key] = sourceVal;
      }
    }
  }

  return result as T;
}