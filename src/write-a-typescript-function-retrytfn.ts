// bloom-deps:

function delay(ms: number): Promise<void> {
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
  if (!Number.isInteger(maxAttempts) || maxAttempts < 1) {
    throw new TypeError('maxAttempts must be an integer >= 1');
  }
  if (typeof delayMs !== 'number' || !Number.isFinite(delayMs) || delayMs < 0) {
    throw new TypeError('delayMs must be a non-negative finite number');
  }

  let lastError: unknown;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const result = await fn();
      return result;
    } catch (err) {
      lastError = err;
      if (attempt < maxAttempts - 1) {
        await delay(delayMs);
      }
    }
  }

  throw lastError;
}