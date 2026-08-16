// bloom-deps:

function debounce<T extends (...args: unknown[]) => void>(fn: T, delayMs: number): T {
  if (typeof fn !== 'function') {
    throw new TypeError(`Expected fn to be a function, but received ${typeof fn}`);
  }

  if (typeof delayMs !== 'number' || delayMs === null || isNaN(delayMs)) {
    throw new TypeError(`Expected delayMs to be a non-negative number, but received ${delayMs}`);
  }

  if (delayMs < 0 || !isFinite(delayMs)) {
    throw new TypeError(`Expected delayMs to be a non-negative number, but received ${delayMs}`);
  }

  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const debounced = function (...args: unknown[]) {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      timeoutId = undefined;
      fn(...args);
    }, delayMs);
  };

  return debounced as T;
}

export { debounce };