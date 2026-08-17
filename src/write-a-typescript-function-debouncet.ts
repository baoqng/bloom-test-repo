// bloom-deps:

function debounce<T extends (...args: unknown[]) => void>(fn: T, delayMs: number): T {
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }

  if (typeof delayMs !== 'number' || !isFinite(delayMs) || delayMs < 0) {
    throw new TypeError('delayMs must be a non-negative finite number');
  }

  let timerId: ReturnType<typeof setTimeout> | undefined;

  const debounced = function (...args: unknown[]): void {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      timerId = undefined;
      fn(...args);
    }, delayMs);
  };

  return debounced as T;
}

export { debounce };