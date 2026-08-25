// bloom-deps:

import { randomUUID } from "crypto";

class ServiceError extends Error {
  constructor(
    message: string,
    public context: { cause?: Error } = {}
  ) {
    super(message);
    this.name = "ServiceError";
  }
}

async function retryWithBackoff(
  fn: () => Promise<unknown>,
  maxAttempts: number,
  baseDelayMs: number
): Promise<unknown> {
  // Input validation
  if (typeof maxAttempts !== "number" || maxAttempts < 1) {
    throw new TypeError("maxAttempts must be a number >= 1");
  }

  if (typeof baseDelayMs !== "number" || baseDelayMs < 0) {
    throw new TypeError("baseDelayMs must be a non-negative number");
  }

  if (typeof fn !== "function") {
    throw new TypeError("fn must be a function");
  }

  let lastError: unknown;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // If this is not the last attempt, wait before retrying
      if (attempt < maxAttempts - 1) {
        const delayMs = baseDelayMs * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  // All attempts exhausted; rethrow the last error
  throw lastError;
}

export { retryWithBackoff, ServiceError };