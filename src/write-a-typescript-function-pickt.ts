// bloom-deps:

function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  // Validate that obj is a non-null object
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    throw new TypeError('First argument must be a non-null object');
  }

  // Validate that keys is a non-empty Array
  if (!Array.isArray(keys)) {
    throw new TypeError('Second argument must be an Array');
  }

  if (keys.length === 0) {
    throw new TypeError('Keys array must not be empty');
  }

  // Validate that all elements in keys are valid (strings or symbols)
  for (const key of keys) {
    if (typeof key !== 'string' && typeof key !== 'symbol') {
      throw new TypeError('All keys must be strings or symbols');
    }
  }

  // Create a new object with only the specified keys
  const result = {} as Pick<T, K>;

  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }

  return result;
}

export { pick };