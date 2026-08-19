// bloom-deps:

import { setTimeout as sleep } from 'timers/promises';

function isNonNegativeFiniteNumber(x: unknown): x is number {
  return typeof x === 'number' && !isNaN(x) && isFinite(x) && x >= 0;
}

export function retry<T extends (...args: unknown[]) => Promise<unknown>>(
  maxAttempts: number,
  delayMs: number = 0.0,
  exceptions: Array<new (...args: unknown[]) => Error> = [Error]
): (fn: T) => (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>> {
  if (!Number.isInteger(maxAttempts) || maxAttempts < 1) {
    throw new TypeError('maxAttempts must be a positive integer >= 1');
  }

  if (!isNonNegativeFiniteNumber(delayMs)) {
    throw new TypeError('delay must be a non-negative finite number');
  }

  return function (fn: T): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>> {
    return async function (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> {
      let lastError: unknown;

      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
          const result = await fn(...args);
          return result as Awaited<ReturnType<T>>;
        } catch (err) {
          const isRetryable = exceptions.some(
            (ExceptionClass) => err instanceof ExceptionClass
          );

          if (!isRetryable) {
            throw err;
          }

          lastError = err;

          if (attempt < maxAttempts - 1 && delayMs > 0) {
            await sleep(delayMs * 1000);
          }
        }
      }

      throw lastError;
    };
  };
}

export { isNonNegativeFiniteNumber };