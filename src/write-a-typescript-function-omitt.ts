// bloom-deps:

function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    throw new TypeError('First argument must be a non-null, non-array object');
  }

  if (!Array.isArray(keys)) {
    throw new TypeError('Second argument must be an Array');
  }

  const keySet = new Set<unknown>(keys);
  const result = {} as Omit<T, K>;

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (!keySet.has(key)) {
        (result as Record<string, unknown>)[key] = (obj as Record<string, unknown>)[key];
      }
    }
  }

  return result;
}

export { omit };