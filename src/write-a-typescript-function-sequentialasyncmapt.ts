// bloom-deps:

export async function sequentialAsyncMap<T, R>(
  items: unknown,
  fn: unknown
): Promise<R[]> {
  if (!Array.isArray(items)) {
    throw new TypeError("items must be an array");
  }

  if (typeof fn !== "function") {
    throw new TypeError("fn must be a function");
  }

  const results: R[] = [];

  for (let index = 0; index < items.length; index++) {
    const result = await (fn as (item: T, index: number) => Promise<R>)(
      items[index],
      index
    );
    results.push(result);
  }

  return results;
}