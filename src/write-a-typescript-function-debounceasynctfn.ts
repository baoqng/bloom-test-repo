// bloom-deps:

export function debounceAsync<T>(
  fn: (...args: unknown[]) => Promise<T>,
  waitMs: unknown
): (...args: unknown[]) => Promise<T> {
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }
  if (typeof waitMs !== 'number' || !isFinite(waitMs)) {
    throw new TypeError('waitMs must be a finite number');
  }
  if (!Number.isInteger(waitMs) || waitMs <= 0) {
    throw new RangeError('waitMs must be a positive integer');
  }

  const wait = waitMs as number;

  let timer: ReturnType<typeof setTimeout> | null = null;
  let pendingResolvers: Array<(value: T) => void> = [];
  let pendingRejectors: Array<(reason: unknown) => void> = [];
  let latestArgs: unknown[] = [];

  return function (...args: unknown[]): Promise<T> {
    latestArgs = args;

    if (timer !== null) {
      clearTimeout(timer);
    }

    const promise = new Promise<T>((resolve, reject) => {
      pendingResolvers.push(resolve);
      pendingRejectors.push(reject);
    });

    timer = setTimeout(async () => {
      timer = null;

      const resolvers = pendingResolvers;
      const rejectors = pendingRejectors;
      const callArgs = latestArgs;

      pendingResolvers = [];
      pendingRejectors = [];
      latestArgs = [];

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