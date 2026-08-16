// bloom-deps:

function debounce<T extends (...args: unknown[]) => void>(fn: T, delayMs: number): T {
  if (typeof fn !== 'function') {
    throw new TypeError(`Expected fn to be a function, but received ${typeof fn}`);
  }

  if (typeof delayMs !== 'number' || isNaN(delayMs)) {
    throw new TypeError(`Expected delayMs to be a number, but received ${typeof delayMs}`);
  }

  if (delayMs < 0) {
    throw new TypeError(`Expected delayMs to be a non-negative number, but received ${delayMs}`);
  }

  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const debounced = function (this: unknown, ...args: unknown[]) {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      timeoutId = undefined;
      fn.apply(this, args);
    }, delayMs);
  };

  return debounced as T;
}

export { debounce };