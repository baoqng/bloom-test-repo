// bloom-deps:

class ServiceError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options as ErrorOptions);
    this.name = 'ServiceError';
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function retryOperation<T>(
  fn: () => Promise<T>,
  maxAttempts: number
): Promise<T> {
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }

  if (
    typeof maxAttempts !== 'number' ||
    !Number.isInteger(maxAttempts) ||
    maxAttempts < 1
  ) {
    throw new TypeError('maxAttempts must be a positive integer');
  }

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const result = await fn();
      return result;
    } catch (error) {
      lastError = error;
      if (attempt < maxAttempts) {
        await sleep(100);
      }
    }
  }

  throw lastError;
}