// bloom-deps:

function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  if (obj === null || typeof obj !== 'object') {
    throw new TypeError('obj must be a non-null object');
  }
  if (!Array.isArray(keys)) {
    throw new TypeError('keys must be an array');
  }
  if (keys.length === 0) {
    throw new TypeError('keys must be a non-empty array');
  }

  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = obj[key];
    }
  }
  return result;
}

export { pick };