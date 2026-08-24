// bloom-deps:

import { setTimeout } from 'timers/promises';

export class ServiceError extends Error {
  constructor(
    message: string,
    public readonly context?: { cause?: Error }
  ) {
    super(message);
    this.name = 'ServiceError';
  }
}

export async function withRetryAsync<T>(
  fn: () => Promise<T>,
  maxAttempts: number,
  delayMs: number
): Promise<T> {
  // Validate fn is a function
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }

  // Validate maxAttempts is a finite number
  if (typeof maxAttempts !== 'number' || !Number.isFinite(maxAttempts)) {
    throw new TypeError('maxAttempts must be a finite number');
  }

  // Validate delayMs is a finite number
  if (typeof delayMs !== 'number' || !Number.isFinite(delayMs)) {
    throw new TypeError('delayMs must be a finite number');
  }

  // Validate maxAttempts is a positive integer
  if (!Number.isInteger(maxAttempts) || maxAttempts <= 0) {
    throw new RangeError('maxAttempts must be a positive integer');
  }

  // Validate delayMs is not negative
  if (delayMs < 0) {
    throw new RangeError('delayMs must not be negative');
  }

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const result = await fn();
      return result;
    } catch (error) {
      lastError = error;

      // If this is not the last attempt, wait before retrying
      if (attempt < maxAttempts) {
        await setTimeout(delayMs);
      }
    }
  }

  // All attempts failed; throw the last error directly
  throw lastError;
}