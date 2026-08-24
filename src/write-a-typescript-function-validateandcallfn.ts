// bloom-deps:

function validateAndCall(fn: (x: number) => void, delayMs: number): void {
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }

  if (typeof delayMs !== 'number' || !isFinite(delayMs)) {
    throw new TypeError('delayMs must be a finite number');
  }

  if (delayMs < 0) {
    throw new TypeError('delayMs must be a non-negative number');
  }

  setTimeout(() => fn(delayMs), delayMs);
}

export { validateAndCall };