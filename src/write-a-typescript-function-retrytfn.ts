// bloom-deps:

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number,
  delayMs: number
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

  if (typeof delayMs !== 'number' || delayMs < 0) {
    throw new TypeError('delayMs must be a non-negative number');
  }

  let lastError: unknown;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < maxAttempts - 1) {
        await sleep(delayMs);
      }
    }
  }

  throw lastError;
}