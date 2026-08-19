// bloom-deps:

function debounce<T extends (...args: unknown[]) => void>(fn: T, delayMs: number): T {
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }
  if (typeof delayMs !== 'number' || delayMs < 0 || !Number.isFinite(delayMs)) {
    throw new TypeError('delayMs must be a non-negative number');
  }

  let timeoutId: NodeJS.Timeout | null = null;

  return ((...args: unknown[]) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delayMs);
  }) as T;
}

export { debounce };