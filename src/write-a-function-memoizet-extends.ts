// bloom-deps:

function memoize<T extends (...args: unknown[]) => unknown>(fn: T): T {
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }

  const cache = new Map<string, unknown>();

  const memoized = function (...args: unknown[]): unknown {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };

  return memoized as T;
}

export { memoize };