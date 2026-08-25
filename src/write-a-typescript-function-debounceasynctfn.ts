// bloom-deps:

export function debounceAsync<T>(
  fn: (...args: unknown[]) => Promise<T>,
  waitMs: unknown
): (...args: unknown[]) => Promise<T> {
  if (typeof fn !== "function") {
    throw new TypeError("fn must be a function");
  }
  if (typeof waitMs !== "number" || !isFinite(waitMs)) {
    throw new TypeError("waitMs must be a finite number");
  }
  if (!Number.isInteger(waitMs) || waitMs <= 0) {
    throw new RangeError("waitMs must be a positive integer");
  }

  const wait = waitMs as number;

  let timerId: ReturnType<typeof setTimeout> | undefined;
  let pendingResolvers: Array<(value: T) => void> = [];
  let pendingRejectors: Array<(reason: unknown) => void> = [];
  let lastArgs: unknown[] = [];

  return function (...args: unknown[]): Promise<T> {
    lastArgs = args;

    if (timerId !== undefined) {
      clearTimeout(timerId);
    }

    const promise = new Promise<T>((resolve, reject) => {
      pendingResolvers.push(resolve);
      pendingRejectors.push(reject);
    });

    timerId = setTimeout(async () => {
      timerId = undefined;

      const resolvers = pendingResolvers;
      const rejectors = pendingRejectors;
      const callArgs = lastArgs;

      pendingResolvers = [];
      pendingRejectors = [];
      lastArgs = [];

      try {
        const result = await fn(...callArgs);
        for (const resolve of resolvers) {
          resolve(result);
        }
      } catch (err) {
        for (const reject of rejectors) {
          reject(err);
        }
      }
    }, wait);

    return promise;
  };
}