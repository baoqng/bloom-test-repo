// bloom-deps:

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function withRetryAsync<T>(
  fn: () => Promise<T>,
  maxAttempts: number,
  delayMs: number
): Promise<T> {
  if (typeof fn !== "function") {
    throw new TypeError("fn must be a function");
  }
  if (!Number.isFinite(maxAttempts)) {
    throw new TypeError("maxAttempts must be a finite number");
  }
  if (!Number.isFinite(delayMs)) {
    throw new TypeError("delayMs must be a finite number");
  }
  if (!Number.isInteger(maxAttempts) || maxAttempts < 1) {
    throw new RangeError("maxAttempts must be a positive integer");
  }
  if (delayMs < 0) {
    throw new RangeError("delayMs must not be negative");
  }

  let lastError: unknown;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    if (attempt > 0 && delayMs > 0) {
      await sleep(delayMs);
    }
    try {
      const result = await fn();
      return result;
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError;
}