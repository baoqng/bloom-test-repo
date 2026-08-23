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
  if (
    typeof concurrency !== 'number' ||
    !isFinite(concurrency) ||
    !Number.isInteger(concurrency) ||
    concurrency <= 0
  ) {
    throw new TypeError('concurrency must be a positive integer');
  }

  const results: U[] = new Array(arr.length);

  for (let i = 0; i < arr.length; i += concurrency) {
    const batch = arr.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map((item) => fn(item))
    );
    for (let j = 0; j < batchResults.length; j++) {
      results[i + j] = batchResults[j];
    }
  }

  return results;
}

export { mapConcurrent };