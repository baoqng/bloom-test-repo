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
    } catch (error: unknown) {
      lastError = error;

      const hasStatus429 =
        error !== null &&
        typeof error === 'object' &&
        'status' in error &&
        (error as { status: unknown }).status === 429;

      if (!hasStatus429) {
        throw error;
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