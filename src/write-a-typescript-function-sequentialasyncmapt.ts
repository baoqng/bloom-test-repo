function sequentialAsyncMap<T, R>(items: unknown, fn: unknown): Promise<R[]> {
  if (!Array.isArray(items)) {
    throw new TypeError("items must be an array");
  }
  if (typeof fn !== "function") {
    throw new TypeError("fn must be a function");
  }

  return (async () => {
    const results: R[] = [];
    for (let i = 0; i < items.length; i++) {
      const result = await (fn as (item: T, index: number) => Promise<R>)(items[i] as T, i);
      results.push(result);
    }
    return results;
  })();
}

export { sequentialAsyncMap };