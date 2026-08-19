// bloom-deps:

async function withRetryOnRateLimit<T>(fn: () => Promise<T>, maxRetries: number): Promise<T> {
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }
  if (!Number.isInteger(maxRetries) || maxRetries < 0) {
    throw new TypeError('maxRetries must be a non-negative integer');
  }

  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err: unknown) {
      const error = err as { status?: number; statusCode?: number };
      const status = error?.status ?? error?.statusCode;

      if (status === 429) {
        lastError = err;
        if (attempt < maxRetries) {
          const delayMs = 100 * Math.pow(2, attempt);
          await new Promise<void>((resolve) => setTimeout(resolve, delayMs));
          continue;
        }
      } else {
        throw err;
      }
    }
  }

  throw lastError;
}

export { withRetryOnRateLimit };