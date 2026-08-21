// bloom-deps:

function withRetryAsync<T>(
  fn: () => Promise<T>,
  maxAttempts: number
): Promise<T> {
  // Validate maxAttempts synchronously before any async operation
  if (!Number.isInteger(maxAttempts) || maxAttempts <= 0) {
    throw new RangeError("maxAttempts must be a positive integer");
  }

  // Validate fn synchronously before any async operation
  if (typeof fn !== "function") {
    throw new TypeError("fn must be a function");
  }

  return (async () => {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (e) {
        lastError = e as Error;
        // Only delay between retries, not after the last attempt
        if (attempt < maxAttempts - 1) {
          await new Promise((r) => setTimeout(r, 100 * Math.pow(2, attempt)));
        }
      }
    }

    // All attempts failed; reject with the last error
    throw lastError;
  })();
}

export { withRetryAsync };