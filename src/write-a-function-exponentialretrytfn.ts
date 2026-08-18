// bloom-deps:

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function exponentialRetry<T>(
  fn: () => Promise<T>,
  maxAttempts: number,
  initialDelayMs: number
): Promise<T> {
  if (typeof fn !== "function") {
    throw new TypeError("fn must be a function");
  }
  if (!Number.isInteger(maxAttempts) || maxAttempts < 1) {
    throw new TypeError("maxAttempts must be a positive integer");
  }
  if (typeof initialDelayMs !== "number" || isNaN(initialDelayMs) || initialDelayMs < 0) {
    throw new TypeError("initialDelayMs must be a non-negative number");
  }

  let lastError: unknown;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < maxAttempts - 1) {
        const delayMs = initialDelayMs * Math.pow(2, attempt);
        await sleep(delayMs);
      }
    }
  }

  throw lastError;
}