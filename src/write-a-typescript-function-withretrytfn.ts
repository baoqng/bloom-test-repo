// bloom-deps:

function withRetry<T>(fn: () => T, maxAttempts: number): T {
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }

  if (
    typeof maxAttempts !== 'number' ||
    !Number.isInteger(maxAttempts) ||
    maxAttempts < 1
  ) {
    throw new RangeError('maxAttempts must be a positive integer');
  }

  let lastError: unknown;

  for (let i = 0; i < maxAttempts; i++) {
    try {
      return fn();
    } catch (e) {
      lastError = e;
    }
  }

  throw lastError;
}

export { withRetry };