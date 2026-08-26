// bloom-deps:

function groupByExtractor<T, K>(items: unknown, keyFn: unknown): Map<K, T[]> {
  if (!Array.isArray(items)) {
    throw new TypeError("items must be an array");
  }
  if (typeof keyFn !== "function") {
    throw new TypeError("keyFn must be a function");
  }

  const result = new Map<K, T[]>();

  for (let i = 0; i < items.length; i++) {
    const item = items[i] as T;
    const key = (keyFn as (item: T, index: number) => K)(item, i);

    if (result.has(key)) {
      result.get(key)!.push(item);
    } else {
      result.set(key, [item]);
    }
  }

  return result;
}

export { groupByExtractor };