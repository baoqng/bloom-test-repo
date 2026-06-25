```
import { ServiceError } from './errors';

export async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts: number,
  baseDelayMs: number
): Promise<T> {
  if (maxAttempts <= 0) {
    throw new RangeError(`maxAttempts must be greater than zero, received: ${maxAttempts}`);
  }

  let lastError: unknown;

  for (let attemptIndex = 0; attemptIndex < maxAttempts; attemptIndex++) {
    try {
      const result = await fn();
      return result;
    } catch (error) {
      lastError = error;

      const isLastAttempt = attemptIndex === maxAttempts - 1;
      if (isLastAttempt) {
        break;
      }

      const delayMs = baseDelayMs * Math.pow(2, attemptIndex);
      await new Promise<void>((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw new ServiceError(
    `withRetry exhausted all ${maxAttempts} attempt(s)`,
    { cause: lastError }
  );
}

export { ServiceError };
```