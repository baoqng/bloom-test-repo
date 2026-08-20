// bloom-deps:

function mapValues<T, U>(
  obj: Record<string, T>,
  mapFn: (value: T, key: string) => U
): Record<string, U> {
  if (typeof obj !== 'object' || obj === null) {
    throw new TypeError('obj must be a non-null object');
  }
  if (typeof mapFn !== 'function') {
    throw new TypeError('mapFn must be a function');
  }

  const result: Record<string, U> = {};

  for (const key of Object.keys(obj)) {
    result[key] = mapFn(obj[key], key);
  }

  return result;
}

export { mapValues };