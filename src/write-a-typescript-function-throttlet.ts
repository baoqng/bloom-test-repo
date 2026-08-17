// bloom-deps:

function throttle<T extends (...args: unknown[]) => void>(fn: T, intervalMs: number): T {
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }
  if (typeof intervalMs !== 'number' || !isFinite(intervalMs) || intervalMs <= 0) {
    throw new TypeError('intervalMs must be a positive finite number');
  }

  let lastInvokedAt: number | null = null;

  return function (this: unknown, ...args: unknown[]) {
    const now = Date.now();
    if (lastInvokedAt === null || now - lastInvokedAt >= intervalMs) {
      lastInvokedAt = now;
      fn.apply(this, args);
    }
  } as T;
}

export { throttle };