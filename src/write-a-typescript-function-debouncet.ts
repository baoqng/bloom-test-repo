// bloom-deps:

function debounce<T extends (...args: unknown[]) => void>(fn: T, delayMs: number): T {
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }

  if (typeof delayMs !== 'number' || delayMs < 0) {
    throw new TypeError('delayMs must be a non-negative number');
  }

  if (isNaN(delayMs) || !isFinite(delayMs)) {
    throw new TypeError('delayMs must be a finite non-negative number');
  }

  let timer: ReturnType<typeof setTimeout> | undefined;

  return function (this: unknown, ...args: unknown[]) {
    if (timer !== undefined) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      timer = undefined;
      fn.apply(this, args);
    }, delayMs);
  } as T;
}

export { debounce };