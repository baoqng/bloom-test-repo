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
  if (typeof concurrency !== "number" || !isFinite(concurrency)) {
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
    while (true) {
      if (rejected) return;
      const currentIndex = index++;
      if (currentIndex >= typedItems.length) return;

      try {
        const promise = typedFn(typedItems[currentIndex], currentIndex);
        promise.catch(() => {});
        const result = await promise;
        if (rejected) return;
        results[currentIndex] = result;
      } catch (err) {
        if (!rejected) {
          rejected = true;
          rejectError = err;
        }
        return;
      }
    }
  }

  const workers: Promise<void>[] = [];
  const actualConcurrency = Math.min(concurrency, typedItems.length);
  for (let i = 0; i < actualConcurrency; i++) {
    workers.push(worker());
  }

  return Promise.all(workers).then(() => {
    if (rejected) {
      throw rejectError;
    }
    return results;
  });
}