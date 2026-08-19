// bloom-deps:

async function withRetryOnRateLimit<T>(fn: () => Promise<T>, maxRetries: number): Promise<T> {
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }

  if (
    typeof maxRetries !== 'number' ||
    !Number.isInteger(maxRetries) ||
    maxRetries < 0
  ) {
    throw new TypeError('maxRetries must be a non-negative integer');
  }

  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err: unknown) {
      lastError = err;

      const status =
        err !== null &&
        typeof err === 'object' &&
        'status' in err &&
        (err as { status: unknown }).status;

      if (status !== 429) {
        throw lastError;
      }

      if (attempt < maxRetries) {
        const delayMs = 100 * Math.pow(2, attempt);
        await new Promise<void>((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  throw lastError;
}

export { withRetryOnRateLimit };