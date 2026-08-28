// bloom-deps:

export async function retryWithLastError<T>(
  fn: () => Promise<T>,
  maxAttempts: unknown,
  delayMs: unknown
): Promise<T> {
  if (
    typeof maxAttempts !== 'number' ||
    !Number.isInteger(maxAttempts) ||
    maxAttempts < 1
  ) {
    throw new TypeError('maxAttempts must be a positive integer');
  }

  if (
    typeof delayMs !== 'number' ||
    !Number.isInteger(delayMs) ||
    delayMs < 0
  ) {
    throw new TypeError('delayMs must be a non-negative integer');
  }

  const maxA = maxAttempts as number;
  const delay = delayMs as number;

  let lastError: unknown;

  for (let attempt = 0; attempt < maxA; attempt++) {
    try {
      const result = await fn();
      return result;
    } catch (err) {
      lastError = err;
      if (attempt < maxA - 1 && delay > 0) {
        await new Promise<void>((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}