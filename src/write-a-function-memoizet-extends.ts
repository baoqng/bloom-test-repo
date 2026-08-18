// bloom-deps:

function memoize<T extends (...args: unknown[]) => unknown>(fn: T): T {
  if (typeof fn !== 'function') {
    throw new TypeError('Argument must be a function');
  }

  const cache = new Map<string, unknown>();

  return ((...args: unknown[]) => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(...args);
    cache.set(key, result);

    return result;
  }) as T;
}

export { memoize };