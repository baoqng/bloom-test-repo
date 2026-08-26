// bloom-deps:

export function mapWithConcurrency<T, R>(
  items: unknown,
  fn: unknown,
  concurrency: unknown
): Promise<R[]> {
  if (!Array.isArray(items)) {
    throw new TypeError("items must be an array");
  }
  if (typeof fn !== "function") {
    throw new TypeError("fn must be a function");
  }
  if (typeof concurrency !== "number" || !Number.isFinite(concurrency)) {
    throw new TypeError("concurrency must be a finite number");
  }
  if (!Number.isInteger(concurrency) || concurrency < 1) {
    throw new RangeError("concurrency must be a positive integer");
  }

  const typedFn = fn as (item: T, index: number) => Promise<R>;
  const typedItems = items as T[];
  const results: R[] = new Array(typedItems.length);

  let index = 0;
  let rejected = false;
  let rejectError: unknown;

  async function worker(): Promise<void> {
    while (index < typedItems.length) {
      if (rejected) return;
      const currentIndex = index++;
      const item = typedItems[currentIndex];
      try {
        const result = await typedFn(item, currentIndex);
        results[currentIndex] = result;
      } catch (err) {
        rejected = true;
        rejectError = err;
        return;
      }
    }
  }

  const workerCount = Math.min(concurrency, typedItems.length);
  if (workerCount === 0) {
    return Promise.resolve(results);
  }

  const workers = Array.from({ length: workerCount }, () => worker());
  return Promise.all(workers).then(() => {
    if (rejected) {
      throw rejectError;
    }
    return results;
  });
}