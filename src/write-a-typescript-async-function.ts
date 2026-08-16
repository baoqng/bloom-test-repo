// bloom-deps:

async function mapConcurrent<T, U>(
  arr: T[],
  fn: (item: T) => Promise<U>,
  concurrency: number
): Promise<U[]> {
  if (!Array.isArray(arr)) {
    throw new TypeError(`Expected arr to be an Array, got ${typeof arr}`);
  }
  if (typeof fn !== 'function') {
    throw new TypeError(`Expected fn to be a function, got ${typeof fn}`);
  }
  if (
    typeof concurrency !== 'number' ||
    !Number.isInteger(concurrency) ||
    concurrency <= 0
  ) {
    throw new TypeError(
      `Expected concurrency to be a positive integer, got ${concurrency}`
    );
  }

  const results: U[] = new Array(arr.length);

  let index = 0;

  async function worker(): Promise<void> {
    while (index < arr.length) {
      const currentIndex = index;
      index += 1;
      try {
        results[currentIndex] = await fn(arr[currentIndex]);
      } catch (error) {
        throw new Error(
          `mapConcurrent: processing item at index ${currentIndex} failed`,
          { cause: error }
        );
      }
    }
  }

  const workerCount = Math.min(concurrency, arr.length === 0 ? 1 : arr.length);
  const workers: Promise<void>[] = [];

  for (let i = 0; i < workerCount; i++) {
    workers.push(worker());
  }

  try {
    await Promise.all(workers);
  } catch (error) {
    throw new Error('mapConcurrent: one or more items failed to process', {
      cause: error,
    });
  }

  return results;
}

export { mapConcurrent };