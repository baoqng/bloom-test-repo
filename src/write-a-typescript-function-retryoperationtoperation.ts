// bloom-deps:

function retryOperation<T>(operation: () => T, retries: number): T {
  if (typeof operation !== 'function') {
    throw new TypeError('operation must be a function');
  }

  if (!Number.isInteger(retries) || retries < 0) {
    throw new RangeError('retries must be a non-negative integer');
  }

  const totalAttempts = retries + 1;
  let lastError: unknown;

  for (let attempt = 0; attempt < totalAttempts; attempt++) {
    try {
      return operation();
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError;
}

export { retryOperation };