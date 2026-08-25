// bloom-deps:

export function limitConcurrency<T>(
  fn: (...args: unknown[]) => Promise<T>,
  limit: unknown
): (...args: unknown[]) => Promise<T> {
  if (typeof fn !== "function") {
    throw new TypeError("fn must be a function");
  }

  if (typeof limit !== "number" || !Number.isFinite(limit)) {
    throw new TypeError("limit must be a finite number");
  }

  if (!Number.isInteger(limit) || limit < 1) {
    throw new RangeError("limit must be a positive integer");
  }

  const concurrencyLimit = limit as number;
  let running = 0;
  const queue: Array<() => void> = [];

  return async function (...args: unknown[]): Promise<T> {
    if (running >= concurrencyLimit) {
      await new Promise<void>((resolve) => {
        queue.push(resolve);
      });
    }

    running++;

    try {
      const result = await fn(...args);
      return result;
    } finally {
      running--;
      if (queue.length > 0) {
        const next = queue.shift();
        if (next) {
          next();
        }
      }
    }
  };
}