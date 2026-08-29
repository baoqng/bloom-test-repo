// bloom-deps:

function buildSortedIndex<T>(items: unknown, keyFn: unknown): Map<string, T[]> {
  if (!Array.isArray(items)) {
    throw new TypeError("items must be an array");
  }
  if (typeof keyFn !== "function") {
    throw new TypeError("keyFn must be a function");
  }

  const unsorted = new Map<string, T[]>();

  for (const item of items) {
    const key = keyFn(item);
    if (typeof key !== "string") {
      throw new TypeError("keyFn must return a string");
    }
    if (!unsorted.has(key)) {
      unsorted.set(key, []);
    }
    unsorted.get(key)!.push(item as T);
  }

  const sortedKeys = Array.from(unsorted.keys()).sort((a, b) =>
    a < b ? -1 : a > b ? 1 : 0
  );

  const result = new Map<string, T[]>();
  for (const key of sortedKeys) {
    result.set(key, unsorted.get(key)!);
  }

  return result;
}

export { buildSortedIndex };