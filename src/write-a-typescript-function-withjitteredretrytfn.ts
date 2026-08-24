// bloom-deps:

export class ServiceError extends Error {
  constructor(
    message: string,
    public details?: { cause?: Error }
  ) {
    super(message);
    this.name = 'ServiceError';
  }
}

export async function withJitteredRetry<T>(
  fn: () => Promise<T>,
  maxAttempts: number,
  baseDelayMs: number
): Promise<T> {
  // Validate fn is a function
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }

  // Validate maxAttempts is a positive finite integer
  if (
    typeof maxAttempts !== 'number' ||
    !Number.isInteger(maxAttempts) ||
    !Number.isFinite(maxAttempts) ||
    maxAttempts <= 0
  ) {
    throw new RangeError('maxAttempts must be a positive finite integer');
  }

  // Validate baseDelayMs is a non-negative finite number
  if (
    typeof baseDelayMs !== 'number' ||
    !Number.isFinite(baseDelayMs) ||
    baseDelayMs < 0
  ) {
    throw new RangeError('baseDelayMs must be a non-negative finite number');
  }

  let lastError: unknown;

  for (let attemptIndex = 0; attemptIndex < maxAttempts; attemptIndex++) {
    try {
      const result = await fn();
      return result;
    } catch (error) {
      lastError = error;

      // If this is not the last attempt, wait before retrying
      if (attemptIndex < maxAttempts - 1) {
        const jitteredDelay =
          Math.random() * baseDelayMs * Math.pow(2, attemptIndex);
        await new Promise((resolve) => setTimeout(resolve, jitteredDelay));
      }
    }
  }

  // All attempts failed; rethrow the last error directly
  if (lastError !== undefined) {
    throw lastError;
  }

  // This should not be reachable, but for type safety
  throw new Error('All retry attempts failed');
}