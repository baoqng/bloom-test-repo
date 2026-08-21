// bloom-deps:

async function executeWithRetries<T>(task: () => Promise<T>, maxRetries: number): Promise<T> {
  if (typeof task !== 'function') {
    throw new TypeError('task must be a function');
  }

  if (!Number.isInteger(maxRetries) || maxRetries < 0) {
    throw new RangeError('maxRetries must be a non-negative integer');
  }

  const maxAttempts = maxRetries + 1;
  let lastErr: unknown;

  for (let i = 0; i < maxAttempts; i++) {
    try {
      return await task();
    } catch (e) {
      lastErr = e;
    }
  }

  throw lastErr;
}

export { executeWithRetries };