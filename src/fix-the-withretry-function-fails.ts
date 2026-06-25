```
import { ServiceError } from './errors';

export async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts: number,
  baseDelayMs: number
): Promise<T> {
  if (maxAttempts <= 0) {
    throw new RangeError('maxAttempts must be greater than 0');
  }

  let lastError: unknown;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      const isLastAttempt = attempt === maxAttempts - 1;
      if (isLastAttempt) {
        throw new ServiceError('operation failed', { cause: error });
      }

      const delayMs = baseDelayMs * Math.pow(2, attempt);
      await new Promise<void>((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw new ServiceError('operation failed', { cause: lastError });
}
```