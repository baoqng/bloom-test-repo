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
    !isFinite(concurrency) ||
    !Number.isInteger(concurrency) ||
    concurrency <= 0
  ) {
    throw new TypeError(
      `Expected concurrency to be a positive integer, got ${concurrency}`
    );
  }

  const results: U[] = new Array(arr.length);

  for (let i = 0; i < arr.length; i += concurrency) {
    const batchIndices: number[] = [];
    for (let j = i; j < Math.min(i + concurrency, arr.length); j++) {
      batchIndices.push(j);
    }

    const batchPromises = batchIndices.map((idx) =>
      fn(arr[idx]).then((result) => {
        results[idx] = result;
      })
    );

    await Promise.all(batchPromises);
  }

  return results;
}

export { mapConcurrent };