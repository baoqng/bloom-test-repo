// bloom-deps:

function withRetryAsync<T>(fn: () => Promise<T>, maxAttempts: number): Promise<T> {
  // Validate fn parameter
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }

  // Validate maxAttempts parameter
  if (typeof maxAttempts !== 'number' || !Number.isFinite(maxAttempts) || !Number.isInteger(maxAttempts) || maxAttempts < 1) {
    throw new RangeError('maxAttempts must be a positive integer');
  }

  return (async () => {
    let lastError: unknown;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (err) {
        lastError = err;
      }
    }

    throw lastError;
  })();
}

export { withRetryAsync };