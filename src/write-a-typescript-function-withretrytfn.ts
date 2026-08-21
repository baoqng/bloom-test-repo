// bloom-deps:

function withRetry<T>(fn: () => T, maxAttempts: number): T {
  if (!Number.isInteger(maxAttempts) || maxAttempts < 1) {
    throw new RangeError(`maxAttempts must be a positive integer, got ${maxAttempts}`);
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