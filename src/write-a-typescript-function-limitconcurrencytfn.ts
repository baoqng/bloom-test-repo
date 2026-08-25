// bloom-deps:

function limitConcurrency<T>(
  fn: (...args: unknown[]) => Promise<T>,
  limit: unknown
): (...args: unknown[]) => Promise<T> {
  if (typeof fn !== "function") {
    throw new TypeError("fn must be a function");
  }

  if (typeof limit !== "number" || !isFinite(limit)) {
    throw new TypeError("limit must be a finite number");
  }

  if (!Number.isInteger(limit) || limit < 1) {
    throw new RangeError("limit must be a positive integer");
  }

  const concurrencyLimit = limit as number;
  let running = 0;
  const queue: Array<{
    args: unknown[];
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: unknown) => void;
  }> = [];

  function next(): void {
    if (queue.length === 0 || running >= concurrencyLimit) {
      return;
    }

    const item = queue.shift()!;
    running++;

    (fn as (...args: unknown[]) => Promise<T>)(...item.args).then(
      (value) => {
        running--;
        item.resolve(value);
        next();
      },
      (reason) => {
        running--;
        item.reject(reason);
        next();
      }
    );
  }

  return function (...args: unknown[]): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      queue.push({ args, resolve, reject });
      next();
    });
  };
}

export { limitConcurrency };