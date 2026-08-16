// bloom-deps:

class ServiceError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'ServiceError';
  }
}

function memoize<K, V>(fn: (key: K) => V): (key: K) => V {
  // Input validation: check that fn is a function
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }

  // Create a Map to store cached results
  const cache = new Map<K, V>();

  // Return the memoized function
  return (key: K): V => {
    // Check if result is already in cache
    if (cache.has(key)) {
      return cache.get(key)!;
    }

    // Call the original function and cache the result
    const result = fn(key);
    cache.set(key, result);

    return result;
  };
}

export { memoize, ServiceError };