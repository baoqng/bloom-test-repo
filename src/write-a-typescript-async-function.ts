// bloom-deps:

async function withRetryOnRateLimit<T>(
  fn: () => Promise<T>,
  maxRetries: number
): Promise<T> {
  // Validate fn parameter
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }

  // Validate maxRetries parameter
  if (!Number.isInteger(maxRetries) || maxRetries < 0) {
    throw new TypeError('maxRetries must be a non-negative integer');
  }

  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (e) {
      lastError = e;

      // Check if error is a rate limit error (429)
      const isRateLimitError =
        e instanceof Error &&
        'status' in e &&
        e.status === 429;

      // If not a rate limit error or no more retries, throw
      if (!isRateLimitError || attempt === maxRetries) {
        throw lastError;
      }

      // Calculate exponential backoff: 100ms × 2^attempt
      const delayMs = 100 * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw lastError;
}

export { withRetryOnRateLimit };