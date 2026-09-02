export function retryWithJitter<T>(
  fn: () => Promise<T>,
  maxAttempts: number,
  baseDelayMs: number
): Promise<T> {
  if (
    typeof maxAttempts !== 'number' ||
    !Number.isInteger(maxAttempts) ||
    maxAttempts < 1
  ) {
    throw new TypeError('maxAttempts must be a positive integer');
  }

  if (
    typeof baseDelayMs !== 'number' ||
    !Number.isInteger(baseDelayMs) ||
    baseDelayMs < 0
  ) {
    throw new TypeError('baseDelayMs must be a non-negative integer');
  }

  return (async () => {
    let lastError: unknown;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (err) {
        lastError = err;
        if (attempt < maxAttempts) {
          const delay = baseDelayMs * Math.pow(2, attempt - 1);
          await new Promise<void>((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError;
  })();
}