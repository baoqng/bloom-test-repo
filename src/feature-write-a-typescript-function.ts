// bloom-deps:

function debounce<T extends (...args: unknown[]) => void>(fn: T, waitMs: number): T {
  if (typeof fn !== 'function') {
    throw new TypeError(`fn must be a function`);
  }
  if (typeof waitMs !== 'number' || isNaN(waitMs)) {
    throw new TypeError(`waitMs must be a number`);
  }
  if (waitMs < 0) {
    throw new RangeError(`waitMs must be non-negative`);
  }

  let timerId: ReturnType<typeof setTimeout> | undefined;

  const debounced = function (...args: unknown[]) {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      timerId = undefined;
      fn(...args);
    }, waitMs);
  } as T;

  return debounced;
}

export { debounce };