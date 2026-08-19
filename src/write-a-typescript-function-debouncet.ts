// bloom-deps:

function debounce<T extends (...args: unknown[]) => void>(fn: T, delayMs: number): T {
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }
  if (typeof delayMs !== 'number' || isNaN(delayMs) || delayMs < 0) {
    throw new TypeError('delayMs must be a non-negative number');
  }

  let timer: ReturnType<typeof setTimeout> | undefined;

  const debounced = function (this: unknown, ...args: unknown[]) {
    if (timer !== undefined) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      timer = undefined;
      fn.apply(this, args);
    }, delayMs);
  };

  return debounced as unknown as T;
}

export { debounce };