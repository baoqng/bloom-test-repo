// bloom-deps:

class ServiceError extends Error {
  constructor(
    message: string,
    public readonly context: { cause?: Error } = {}
  ) {
    super(message);
    this.name = "ServiceError";
  }
}

async function withRetry<T>(
  operation: () => Promise<T>,
  attempts: number,
  delayMs: number
): Promise<T> {
  // Input validation
  if (typeof operation !== "function") {
    throw new TypeError("operation must be a function");
  }

  if (typeof attempts !== "number" || !Number.isInteger(attempts) || attempts <= 0) {
    throw new TypeError("attempts must be a positive integer");
  }

  if (
    typeof delayMs !== "number" ||
    !Number.isFinite(delayMs) ||
    delayMs < 0
  ) {
    throw new TypeError("delayMs must be a non-negative finite number");
  }

  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      // Capture the error from this attempt
      lastError = error instanceof Error ? error : new Error(String(error));

      // If this is not the last attempt, wait before retrying
      if (attempt < attempts) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  // All attempts exhausted; rethrow the last error without wrapping
  if (lastError) {
    throw lastError;
  }

  // This should never be reached, but TypeScript needs a return path
  throw new Error("All retry attempts failed");
}

export { withRetry, ServiceError };