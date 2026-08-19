// bloom-deps:

export function throttle<T extends (...args: unknown[]) => void>(fn: T, intervalMs: number): T {
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }
  if (typeof intervalMs !== 'number' || isNaN(intervalMs) || intervalMs <= 0) {
    throw new TypeError('intervalMs must be a positive number');
  }

  let lastCallTime: number | null = null;

  return function (this: unknown, ...args: unknown[]) {
    const now = Date.now();
    if (lastCallTime === null || now - lastCallTime >= intervalMs) {
      lastCallTime = now;
      fn.apply(this, args);
    }
  } as T;
}