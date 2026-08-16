// bloom-deps:

function unique<T>(arr: T[], keyFn?: (item: T) => unknown): T[] {
  if (!Array.isArray(arr)) {
    throw new TypeError(`Expected arr to be an Array, but received ${typeof arr}`);
  }

  if (keyFn !== undefined && typeof keyFn !== 'function') {
    throw new TypeError(`Expected keyFn to be a function, but received ${typeof keyFn}`);
  }

  if (keyFn !== undefined) {
    const seenKeys = new Set<unknown>();
    const result: T[] = [];

    for (const item of arr) {
      const key = keyFn(item);
      if (!seenKeys.has(key)) {
        seenKeys.add(key);
        result.push(item);
      }
    }

    return result;
  } else {
    const seen = new Set<T>();
    const result: T[] = [];

    for (const item of arr) {
      if (!seen.has(item)) {
        seen.add(item);
        result.push(item);
      }
    }

    return result;
  }
}

export { unique };