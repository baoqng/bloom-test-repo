// bloom-deps:

export function throttleAsync<T>(
  fn: (...args: unknown[]) => Promise<T>,
  intervalMs: unknown
): (...args: unknown[]) => Promise<T> {
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

  let currentPromise: Promise<T> | null = null;
  let windowStart: number | null = null;
  let isExecuting = false;

  return function (...args: unknown[]): Promise<T> {
    const now = Date.now();

    // Check if we are within an active window and fn hasn't finished its window yet
    if (
      currentPromise !== null &&
      windowStart !== null &&
      now - windowStart < interval
    ) {
      // Return the same promise as the first call
      return currentPromise;
    }

    // Window has expired or no window exists; start a new window
    windowStart = now;

    // No concurrent executions: wrap in a new promise that chains properly
    const promise = (async () => {
      // Wait until any ongoing execution finishes before starting
      // Since we share currentPromise and only one window runs at a time,
      // we simply invoke fn here
      const result = await (fn as (...args: unknown[]) => Promise<T>)(...args);
      return result;
    })();

    currentPromise = promise;

    // After interval expires, clear the window so next call starts fresh
    promise.finally(() => {
      // Only clear if this promise is still the current one and window expired
      // We use setTimeout to mark window as expired after interval
    });

    // Schedule window expiry
    const capturedWindowStart = windowStart;
    setTimeout(() => {
      // Only reset if the window hasn't been superseded
      if (windowStart === capturedWindowStart) {
        currentPromise = null;
        windowStart = null;
      }
    }, interval);

    return currentPromise;
  };
}