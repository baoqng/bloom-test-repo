// bloom-deps:

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  attempts: number,
  delayMs: number
): Promise<T> {
  if (typeof operation !== 'function') {
    throw new TypeError('operation must be a function');
  }

  if (
    typeof attempts !== 'number' ||
    !Number.isInteger(attempts) ||
    attempts < 1
  ) {
    throw new TypeError('attempts must be a positive integer');
  }

  if (
    typeof delayMs !== 'number' ||
    !Number.isFinite(delayMs) ||
    delayMs < 0
  ) {
    throw new TypeError('delayMs must be a non-negative finite number');
  }

  let lastError: unknown;

  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      const result = await operation();
      return result;
    } catch (error) {
      lastError = error;
      if (attempt < attempts - 1) {
        await sleep(delayMs);
      }
    }
  }

  throw lastError;
}