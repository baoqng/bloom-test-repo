// bloom-deps:

async function withRetry<T>(fn: () => Promise<T>, maxAttempts: number, delayMs: number): Promise<T> {
  if (
    typeof maxAttempts !== 'number' ||
    !Number.isInteger(maxAttempts) ||
    maxAttempts <= 0 ||
    !isFinite(maxAttempts)
  ) {
    throw new TypeError('maxAttempts must be a positive integer');
  }

  if (
    typeof delayMs !== 'number' ||
    isNaN(delayMs) ||
    delayMs < 0 ||
    !isFinite(delayMs)
  ) {
    throw new TypeError('delayMs must be a non-negative number');
  }

  let lastError: unknown;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < maxAttempts - 1) {
        await new Promise<void>(resolve => setTimeout(resolve, delayMs));
      }
    }
  }

  throw lastError;
}

export { withRetry };