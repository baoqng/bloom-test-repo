// bloom-deps:

async function mapConcurrent<T, U>(
  items: T[],
  fn: (item: T, index: number) => Promise<U>,
  concurrency: number
): Promise<U[]> {
  if (!Array.isArray(items)) {
    throw new TypeError('items must be an array');
  }
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }
  if (!Number.isInteger(concurrency) || concurrency < 1) {
    throw new TypeError('concurrency must be a positive integer');
  }

  const results: U[] = new Array(items.length);
  let nextIndex = 0;

  async function worker(): Promise<void> {
    while (nextIndex < items.length) {
      const index = nextIndex++;
      results[index] = await fn(items[index], index);
    }
  }

  const workers: Promise<void>[] = [];
  const limit = Math.min(concurrency, items.length);
  for (let i = 0; i < limit; i++) {
    workers.push(worker());
  }

  await Promise.all(workers);

  return results;
}

export { mapConcurrent };