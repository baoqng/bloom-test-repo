// bloom-deps:

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

interface InFlightEntry<T> {
  promise: Promise<T>;
}

function memoizeAsync<T>(
  fn: (...args: unknown[]) => Promise<T>,
  ttlMs: number
): (...args: unknown[]) => Promise<T> {
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }
  if (
    typeof ttlMs !== 'number' ||
    !isFinite(ttlMs) ||
    ttlMs <= 0
  ) {
    throw new TypeError('ttlMs must be a positive finite number');
  }

  const cache = new Map<string, CacheEntry<T>>();
  const inFlight = new Map<string, InFlightEntry<T>>();

  return async function (...args: unknown[]): Promise<T> {
    const key = JSON.stringify(args);
    const now = Date.now();

    // Check for a valid cached entry
    const cached = cache.get(key);
    if (cached !== undefined) {
      if (now < cached.expiresAt) {
        return cached.value;
      } else {
        // Expired — evict
        cache.delete(key);
      }
    }

    // Check for an in-flight promise
    const inflight = inFlight.get(key);
    if (inflight !== undefined) {
      return inflight.promise;
    }

    // Start a new call
    const promise = (async () => {
      try {
        const result = await fn(...args);
        cache.set(key, {
          value: result,
          expiresAt: Date.now() + ttlMs,
        });
        return result;
      } finally {
        inFlight.delete(key);
      }
    })();

    inFlight.set(key, { promise });

    return promise;
  };
}

export { memoizeAsync };