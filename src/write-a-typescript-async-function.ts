// bloom-deps:

async function withRetryAsync<T>(fn: () => Promise<T>, maxAttempts: number, delayMs: number): Promise<T> {
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }

  if (!Number.isInteger(maxAttempts) || maxAttempts < 1) {
    throw new RangeError('maxAttempts must be a positive integer');
  }

  if (typeof delayMs !== 'number' || !Number.isFinite(delayMs) || delayMs < 0) {
    throw new RangeError('delayMs must be a non-negative finite number');
  }

  let lastError: unknown;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    if (attempt > 0 && delayMs > 0) {
      await new Promise<void>(resolve => setTimeout(resolve, delayMs));
    } else if (attempt > 0 && delayMs === 0) {
      await new Promise<void>(resolve => setTimeout(resolve, 0));
    }

    try {
      return await fn();
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError;
}

export { withRetryAsync };