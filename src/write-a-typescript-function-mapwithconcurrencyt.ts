// bloom-deps:

function mapWithConcurrency<T, R>(
  items: unknown,
  fn: unknown,
  concurrency: unknown
): Promise<R[]> {
  // Validate inputs synchronously and throw immediately
  if (!Array.isArray(items)) {
    throw new TypeError("items must be an array");
  }
  if (typeof fn !== "function") {
    throw new TypeError("fn must be a function");
  }
  if (typeof concurrency !== "number" || !isFinite(concurrency)) {
    throw new TypeError("concurrency must be a finite number");
  }
  if (!Number.isInteger(concurrency) || concurrency <= 0) {
    throw new RangeError("concurrency must be a positive integer");
  }

  const typedFn = fn as (item: T, index: number) => Promise<R>;
  const typedItems = items as T[];
  const results: R[] = new Array(typedItems.length);

  let nextIndex = 0;
  let inFlight = 0;
  let rejected = false;
  let rejectError: unknown;

  return new Promise<R[]>((resolve, reject) => {
    if (typedItems.length === 0) {
      resolve(results);
      return;
    }

    function scheduleNext(): void {
      while (inFlight < (concurrency as number) && nextIndex < typedItems.length && !rejected) {
        const index = nextIndex++;
        inFlight++;

        const p = Promise.resolve().then(() => typedFn(typedItems[index], index));

        p.then(
          (result) => {
            if (rejected) {
              inFlight--;
              return;
            }
            results[index] = result;
            inFlight--;
            if (nextIndex < typedItems.length) {
              scheduleNext();
            } else if (inFlight === 0) {
              resolve(results);
            }
          },
          (err) => {
            inFlight--;
            if (!rejected) {
              rejected = true;
              rejectError = err;
              reject(err);
            }
          }
        );
      }
    }

    scheduleNext();
  });
}

export { mapWithConcurrency };