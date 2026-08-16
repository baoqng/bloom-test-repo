// bloom-deps:

export function unique<T>(arr: T[], keyFn?: (item: T) => unknown): T[] {
  if (!Array.isArray(arr)) {
    throw new TypeError(`Expected arr to be an Array, but received ${typeof arr}`);
  }

  if (keyFn !== undefined && typeof keyFn !== 'function') {
    throw new TypeError(`Expected keyFn to be a function, but received ${typeof keyFn}`);
  }

  const result: T[] = [];

  if (keyFn !== undefined) {
    const seenKeys: unknown[] = [];
    for (const item of arr) {
      const key = keyFn(item);
      let found = false;
      for (const seenKey of seenKeys) {
        if (seenKey === key) {
          found = true;
          break;
        }
      }
      if (!found) {
        seenKeys.push(key);
        result.push(item);
      }
    }
  } else {
    const seen: T[] = [];
    for (const item of arr) {
      let found = false;
      for (const seenItem of seen) {
        if (seenItem === item) {
          found = true;
          break;
        }
      }
      if (!found) {
        seen.push(item);
        result.push(item);
      }
    }
  }

  return result;
}