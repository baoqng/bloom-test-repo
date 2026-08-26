function deduplicateByKey<T>(items: unknown, keyFn: unknown): T[] {
  if (!Array.isArray(items)) {
    throw new TypeError("items must be an array");
  }
  if (typeof keyFn !== "function") {
    throw new TypeError("keyFn must be a function");
  }

  const map = new Map<unknown, T>();

  for (let i = 0; i < items.length; i++) {
    const item = items[i] as T;
    const key = keyFn(item, i);
    if (map.has(key)) {
      map.delete(key);
    }
    map.set(key, item);
  }

  return Array.from(map.values());
}

export { deduplicateByKey };