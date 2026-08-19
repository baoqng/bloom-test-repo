// bloom-deps:

function throttle<T extends (...args: unknown[]) => void>(fn: T, intervalMs: number): T {
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }

  if (typeof intervalMs !== 'number' || isNaN(intervalMs) || !isFinite(intervalMs) || intervalMs <= 0) {
    throw new TypeError('intervalMs must be a non-negative finite number');
  }

  let lastCallTime: number | null = null;

  const throttled = function (this: unknown, ...args: unknown[]) {
    const now = Date.now();

    if (lastCallTime === null || now - lastCallTime >= intervalMs) {
      lastCallTime = now;
      fn.apply(this, args);
    }
  };

  return throttled as unknown as T;
}

export { throttle };