// bloom-deps:

function throttle<T extends (...args: unknown[]) => void>(fn: T, intervalMs: number): T {
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }
  if (typeof intervalMs !== 'number' || !isFinite(intervalMs) || intervalMs <= 0) {
    throw new TypeError('intervalMs must be a positive finite number');
  }

  let lastInvokedAt: number | null = null;

  const throttled = function (...args: unknown[]): void {
    const now = Date.now();
    if (lastInvokedAt === null || now - lastInvokedAt >= intervalMs) {
      lastInvokedAt = now;
      fn(...(args as Parameters<T>));
    }
  };

  return throttled as unknown as T;
}

export { throttle };