function withRetryBackoff<T>(
  fn: () => Promise<T>,
  maxAttempts: unknown,
  initialDelayMs: unknown
): Promise<T> {
  if (typeof fn !== "function") {
    throw new TypeError("fn must be a function");
  }

  if (typeof maxAttempts !== "number" || !isFinite(maxAttempts)) {
    throw new TypeError("maxAttempts must be a finite number");
  }

  if (!Number.isInteger(maxAttempts) || maxAttempts < 1 || maxAttempts > 10) {
    throw new RangeError("maxAttempts must be between 1 and 10");
  }

  if (typeof initialDelayMs !== "number" || !isFinite(initialDelayMs)) {
    throw new TypeError("initialDelayMs must be a finite number");
  }

  if (!Number.isInteger(initialDelayMs) || initialDelayMs <= 0) {
    throw new RangeError("initialDelayMs must be a positive integer");
  }

  return (async () => {
    const delay = (ms: number): Promise<void> =>
      new Promise((resolve) => setTimeout(resolve, ms));

    let lastError: unknown;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const result = await fn();
        return result;
      } catch (err) {
        lastError = err;
        if (attempt < maxAttempts) {
          const waitMs = (initialDelayMs as number) * Math.pow(2, attempt - 1);
          await delay(waitMs);
        }
      }
    }

    throw lastError;
  })();
}

export { withRetryBackoff };