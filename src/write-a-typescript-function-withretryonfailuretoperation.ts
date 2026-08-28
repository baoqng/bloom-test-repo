// bloom-deps:

function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0;
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value > 0;
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function withRetryOnFailure<T>(
  operation: () => Promise<T>,
  attempts: unknown,
  waitMs: unknown
): Promise<T> {
  if (!isPositiveInteger(attempts)) {
    throw new TypeError('attempts must be a positive integer');
  }

  if (!isNonNegativeInteger(waitMs)) {
    throw new TypeError('waitMs must be a non-negative integer');
  }

  let lastError: unknown;

  for (let i = 0; i < attempts; i++) {
    if (i > 0 && waitMs > 0) {
      await wait(waitMs);
    }

    try {
      const result = await operation();
      return result;
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError;
}