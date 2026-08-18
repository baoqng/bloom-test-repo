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
    } catch (e) {
      lastError = e;

      const is429 =
        e !== null &&
        typeof e === 'object' &&
        'status' in e &&
        (e as { status: unknown }).status === 429;

      if (!is429) {
        throw e;
      }

      if (attempt < maxRetries) {
        const backoffMs = 100 * Math.pow(2, attempt);
        await new Promise<void>((resolve) => setTimeout(resolve, backoffMs));
      }
    }
  }

  throw lastError;
}

export { withRetryOnRateLimit };