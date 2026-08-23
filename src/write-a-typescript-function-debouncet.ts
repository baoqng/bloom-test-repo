// bloom-deps:

function debounce<T extends (...args: unknown[]) => void>(fn: T, delayMs: number): T {
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }
  if (typeof delayMs !== 'number' || !isFinite(delayMs) || delayMs < 0) {
    throw new TypeError('delayMs must be a non-negative finite number');
  }

  let timer: ReturnType<typeof setTimeout> | undefined;

  return function (...args: unknown[]) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args as Parameters<T>);
    }, delayMs);
  } as unknown as T;
}

export { debounce };