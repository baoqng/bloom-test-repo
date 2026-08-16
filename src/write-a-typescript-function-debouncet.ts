// bloom-deps:

function debounce<T extends (...args: unknown[]) => void>(fn: T, delayMs: number): T {
  if (typeof fn !== 'function') {
    throw new TypeError(`Expected fn to be a function, but received ${typeof fn}`);
  }

  if (typeof delayMs !== 'number' || !isFinite(delayMs)) {
    throw new TypeError(`Expected delayMs to be a finite number, but received ${typeof delayMs === 'number' ? delayMs : typeof delayMs}`);
  }

  if (delayMs < 0) {
    throw new TypeError(`Expected delayMs to be a non-negative number, but received ${delayMs}`);
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