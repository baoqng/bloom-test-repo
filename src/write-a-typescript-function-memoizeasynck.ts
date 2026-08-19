// bloom-deps:

export function memoizeAsync<K, V>(fn: (key: K) => Promise<V>): (key: K) => Promise<V> {
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }

  const cache = new Map<K, V>();
  const inFlight = new Map<K, Promise<V>>();

  return async (key: K): Promise<V> => {
    if (cache.has(key)) {
      return cache.get(key) as V;
    }

    if (inFlight.has(key)) {
      return inFlight.get(key) as Promise<V>;
    }

    const promise = fn(key).then(
      (value: V) => {
        cache.set(key, value);
        inFlight.delete(key);
        return value;
      },
      (error: unknown) => {
        inFlight.delete(key);
        throw error;
      }
    );

    inFlight.set(key, promise);

    return promise;
  };
}