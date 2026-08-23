// bloom-deps:

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number,
  delayMs: number
): Promise<T> {
  // Validate fn is a function
  if (typeof fn !== "function") {
    throw new TypeError("fn must be a function");
  }

  // Validate maxAttempts is a positive integer
  if (!Number.isInteger(maxAttempts) || maxAttempts < 1) {
    throw new TypeError("maxAttempts must be a positive integer");
  }

  // Validate delayMs is a non-negative number
  if (typeof delayMs !== "number" || delayMs < 0) {
    throw new TypeError("delayMs must be a non-negative number");
  }

  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < maxAttempts) {
        await sleep(delayMs);
      }
    }
  }

  // Rethrow the last caught error after exhausting retries
  throw lastError;
}

export { retry };