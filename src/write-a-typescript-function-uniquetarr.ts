// bloom-deps:

export function unique<T>(arr: T[], keyFn?: (item: T) => unknown): T[] {
  if (!Array.isArray(arr)) {
    throw new TypeError(`Expected arr to be an Array, but received ${typeof arr}`);
  }
  if (keyFn !== undefined && typeof keyFn !== 'function') {
    throw new TypeError(`Expected keyFn to be a function, but received ${typeof keyFn}`);
  }

  const result: T[] = [];

  if (keyFn) {
    const seen = new Map<unknown, boolean>();
    for (const item of arr) {
      const key = keyFn(item);
      if (!seen.has(key)) {
        seen.set(key, true);
        result.push(item);
      }
    }
  } else {
    const seen = new Set<unknown>();
    for (const item of arr) {
      if (!seen.has(item)) {
        seen.add(item);
        result.push(item);
      }
    }
  }

  return result;
}