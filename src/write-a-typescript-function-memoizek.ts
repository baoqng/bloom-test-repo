// bloom-deps:

function memoize<K, V>(fn: (key: K) => V): (key: K) => V {
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }

  const cache = new Map<K, V>();

  return (key: K): V => {
    if (cache.has(key)) {
      return cache.get(key) as V;
    }

    const result = fn(key);
    cache.set(key, result);
    return result;
  };
}

export { memoize };