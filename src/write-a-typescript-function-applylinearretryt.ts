// bloom-deps:

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function applyLinearRetry<T>(
  fn: () => Promise<T>,
  maxAttempts: number,
  delayMs: number
): Promise<T> {
  if (
    typeof maxAttempts !== "number" ||
    !Number.isFinite(maxAttempts) ||
    !Number.isInteger(maxAttempts) ||
    maxAttempts <= 0
  ) {
    throw new TypeError("maxAttempts must be a positive integer");
  }

  if (
    typeof delayMs !== "number" ||
    !Number.isFinite(delayMs) ||
    !Number.isInteger(delayMs) ||
    delayMs < 0
  ) {
    throw new TypeError("delayMs must be a non-negative integer");
  }

  return (async () => {
    let lastError: unknown;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const result = await fn();
        return result;
      } catch (err) {
        lastError = err;
        if (attempt < maxAttempts - 1) {
          await sleep(delayMs);
        }
      }
    }

    throw lastError;
  })();
}