// bloom-deps:

function memoize<T extends (...args: unknown[]) => unknown>(fn: T): T {
  const cache = new Map<string, unknown>();

  const memoized = function (...args: unknown[]): unknown {
    let key: string;
    try {
      key = JSON.stringify(args);
    } catch (e) {
      if (e instanceof SyntaxError) throw e;
      throw new SyntaxError(String(e));
    }

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