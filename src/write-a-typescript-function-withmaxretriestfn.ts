function withMaxRetries<T>(fn: () => Promise<T>, maxAttempts: unknown): Promise<T> {
  if (typeof fn !== "function") {
    throw new TypeError("fn must be a function");
  }

  if (typeof maxAttempts !== "number" || !Number.isFinite(maxAttempts)) {
    throw new TypeError("maxAttempts must be a finite number");
  }

  if (!Number.isInteger(maxAttempts) || maxAttempts < 1) {
    throw new RangeError("maxAttempts must be a positive integer");
  }

  let lastError: unknown;

  return (async () => {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const result = await fn();
        return result;
      } catch (err) {
        lastError = err;
      }
    }

    throw lastError;
  })();
}

export { withMaxRetries };