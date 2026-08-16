// bloom-deps:

async function mapConcurrent<T, U>(
  arr: T[],
  fn: (item: T) => Promise<U>,
  concurrency: number
): Promise<U[]> {
  if (!Array.isArray(arr)) {
    throw new TypeError(
      `Expected arr to be an Array, but received ${typeof arr}`
    );
  }

  if (typeof fn !== "function") {
    throw new TypeError(
      `Expected fn to be a function, but received ${typeof fn}`
    );
  }

  if (
    typeof concurrency !== "number" ||
    !Number.isInteger(concurrency) ||
    concurrency < 1
  ) {
    throw new TypeError(
      `Expected concurrency to be a positive integer, but received ${concurrency}`
    );
  }

  const results: U[] = new Array(arr.length);

  let index = 0;

  async function worker(): Promise<void> {
    while (index < arr.length) {
      const currentIndex = index;
      index += 1;

      const item = arr[currentIndex];
      const result = await fn(item);
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