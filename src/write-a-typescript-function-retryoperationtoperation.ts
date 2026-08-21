// bloom-deps:

function retryOperation<T>(operation: () => T, retries: number): T {
  if (typeof operation !== 'function') {
    throw new TypeError('operation must be a function');
  }

  if (!Number.isInteger(retries) || retries < 0) {
    throw new RangeError('retries must be a non-negative integer');
  }

  const maxAttempts = retries + 1;
  let lastError: unknown;

  for (let i = 0; i < maxAttempts; i++) {
    try {
      return operation();
    } catch (e) {
      lastError = e;
    }
  }

  throw lastError;
}

export { retryOperation };