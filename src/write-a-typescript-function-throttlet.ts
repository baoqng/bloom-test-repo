// bloom-deps:

function throttle<T extends (...args: unknown[]) => void>(fn: T, intervalMs: number): T {
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }
  if (typeof intervalMs !== 'number' || isNaN(intervalMs) || !isFinite(intervalMs) || intervalMs <= 0) {
    throw new TypeError('intervalMs must be a non-negative finite number');
  }

  let active = false;

  return function (this: unknown, ...args: unknown[]) {
    if (!active) {
      fn.apply(this, args);
      active = true;
      setTimeout(() => {
        active = false;
      }, intervalMs);
    }
  } as T;
}

export { throttle };