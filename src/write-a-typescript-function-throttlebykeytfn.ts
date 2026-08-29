// bloom-deps:

function throttleByKey<T>(
  fn: (key: string, ...args: unknown[]) => Promise<T>,
  intervalMs: unknown
): (key: string, ...args: unknown[]) => Promise<T> {
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }

  if (
    typeof intervalMs !== 'number' ||
    !Number.isInteger(intervalMs) ||
    intervalMs <= 0
  ) {
    throw new TypeError('intervalMs must be a positive integer');
  }

  const interval = intervalMs as number;
  const cache = new Map<string, Promise<T>>();

  return function throttled(key: string, ...args: unknown[]): Promise<T> {
    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const promise = fn(key, ...args);
    cache.set(key, promise);

    setTimeout(() => {
      cache.delete(key);
    }, interval);

    return promise;
  };
}

export { throttleByKey };