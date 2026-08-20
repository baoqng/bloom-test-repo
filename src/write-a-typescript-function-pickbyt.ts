// bloom-deps:

function isPlainObject(value: unknown): value is object {
  if (typeof value !== 'object' || value === null) return false;
  let proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function pickBy<T extends object>(
  obj: T,
  predicate: (value: T[keyof T], key: string) => boolean
): Partial<T> {
  if (!isPlainObject(obj)) {
    throw new TypeError('obj must be a plain object');
  }
  if (typeof predicate !== 'function') {
    throw new TypeError('predicate must be a function');
  }

  const result: Partial<T> = {};

  for (const key of Object.keys(obj)) {
    const value = (obj as Record<string, unknown>)[key] as T[keyof T];
    if (predicate(value, key)) {
      (result as Record<string, unknown>)[key] = value;
    }
  }

  return result;
}

export { pickBy };