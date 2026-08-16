// bloom-deps:

function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  if (obj === null || typeof obj !== 'object') {
    throw new TypeError('Expected obj to be a non-null object');
  }
  if (!Array.isArray(keys)) {
    throw new TypeError('Expected keys to be an Array');
  }

  const keySet = new Set<string | symbol>(keys as unknown as (string | symbol)[]);
  const result = {} as Omit<T, K>;

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (!keySet.has(key as unknown as string | symbol)) {
        (result as Record<string, unknown>)[key] = obj[key as keyof T];
      }
    }
  }

  return result;
}

export { omit };