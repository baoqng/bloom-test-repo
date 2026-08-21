// bloom-deps:

function withRetry<T>(fn: () => T, maxAttempts: number): T {
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }

  if (!Number.isInteger(maxAttempts) || !Number.isFinite(maxAttempts) || maxAttempts < 1) {
    throw new RangeError('maxAttempts must be a positive integer');
  }

  let lastError: unknown;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return fn();
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError;
}

export { withRetry };