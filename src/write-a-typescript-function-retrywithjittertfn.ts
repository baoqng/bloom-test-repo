export function retryWithJitter<T>(
  fn: () => Promise<T>,
  maxAttempts: number,
  baseDelayMs: number
): Promise<T> {
  // Validate maxAttempts
  if (
    typeof maxAttempts !== "number" ||
    !Number.isInteger(maxAttempts) ||
    maxAttempts <= 0
  ) {
    throw new TypeError("maxAttempts must be a positive integer");
  }

  // Validate baseDelayMs
  if (
    typeof baseDelayMs !== "number" ||
    !Number.isInteger(baseDelayMs) ||
    baseDelayMs < 0
  ) {
    throw new TypeError("baseDelayMs must be a non-negative integer");
  }

  return (async () => {
    let lastError: unknown;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;

        // If this is not the last attempt, wait before retrying
        if (attempt < maxAttempts) {
          const delayMs = baseDelayMs * Math.pow(2, attempt - 1);
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
      }
    }

    // All attempts exhausted; throw the last captured error directly
    throw lastError;
  })();
}