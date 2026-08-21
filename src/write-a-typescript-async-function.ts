// bloom-deps:

async function executeWithRetries<T>(task: () => Promise<T>, maxRetries: number): Promise<T> {
  if (typeof task !== 'function') {
    throw new TypeError('task must be a function');
  }

  if (!Number.isInteger(maxRetries) || maxRetries < 0) {
    throw new RangeError('maxRetries must be a non-negative integer');
  }

  const totalAttempts = maxRetries + 1;
  let lastError: unknown;

  for (let attempt = 0; attempt < totalAttempts; attempt++) {
    try {
      return await task();
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError;
}

export { executeWithRetries };