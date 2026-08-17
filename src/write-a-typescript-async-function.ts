// bloom-deps:

async function mapConcurrent<T, U>(
  arr: T[],
  fn: (item: T) => Promise<U>,
  concurrency: number
): Promise<U[]> {
  if (!Array.isArray(arr)) {
    throw new TypeError('arr must be an Array');
  }
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }
  if (!Number.isInteger(concurrency) || concurrency <= 0) {
    throw new TypeError('concurrency must be a positive integer');
  }

  const results: U[] = new Array(arr.length);

  let index = 0;

  async function worker(): Promise<void> {
    while (index < arr.length) {
      const currentIndex = index;
      index += 1;
      const result = await fn(arr[currentIndex]);
      results[currentIndex] = result;
    }
  }

  const workers: Promise<void>[] = [];
  const workerCount = Math.min(concurrency, arr.length);
  for (let i = 0; i < workerCount; i++) {
    workers.push(worker());
  }

  await Promise.all(workers);

  return results;
}

export { mapConcurrent };