// bloom-deps:

function throttle<T extends (...args: unknown[]) => void>(fn: T, intervalMs: number): T {
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }
  if (typeof intervalMs !== 'number' || isNaN(intervalMs) || !isFinite(intervalMs) || intervalMs <= 0) {
    throw new TypeError('intervalMs must be a positive finite number');
  }

  let lastExecuted: number | null = null;

  return function (this: unknown, ...args: unknown[]) {
    const now = Date.now();
    if (lastExecuted === null || now - lastExecuted >= intervalMs) {
      lastExecuted = now;
      fn.apply(this, args);
    }
  } as T;
}

export { throttle };