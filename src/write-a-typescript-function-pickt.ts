// bloom-deps:

function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  if (obj === null || obj === undefined || typeof obj !== 'object' || Array.isArray(obj)) {
    throw new TypeError('obj must be a non-null, non-array object');
  }

  if (!Array.isArray(keys)) {
    throw new TypeError('keys must be an array');
  }

  if (keys.length === 0) {
    throw new TypeError('keys must be a non-empty array');
  }

  const result = {} as Pick<T, K>;

  for (const key of keys) {
    if (key === undefined || key === null) {
      throw new TypeError('each key must be a valid, non-null value');
    }
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = obj[key];
    }
  }

  return result;
}

export { pick };