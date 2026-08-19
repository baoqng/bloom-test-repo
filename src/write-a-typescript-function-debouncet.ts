// bloom-deps:

function debounce<T extends (...args: unknown[]) => void>(fn: T, delayMs: number): T {
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }
  if (typeof delayMs !== 'number' || isNaN(delayMs)) {
    throw new TypeError('delayMs must be a number');
  }
  if (delayMs < 0 || !isFinite(delayMs)) {
    throw new TypeError('delayMs must be a non-negative number');
  }

  let timer: ReturnType<typeof setTimeout> | undefined;

  const debounced = function (...args: unknown[]) {
    if (timer !== undefined) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      timer = undefined;
      fn(...args);
    }, Math.round(delayMs));
  } as T;

  return debounced;
}

export { debounce };