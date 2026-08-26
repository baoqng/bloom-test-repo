// bloom-deps:

import { performance } from "perf_hooks";

export function withRetryBackoff<T>(
  fn: unknown,
  maxAttempts: unknown,
  initialDelayMs: unknown
): Promise<T> {
  // Validate fn
  if (typeof fn !== "function") {
    throw new TypeError("fn must be a function");
  }

  // Validate maxAttempts is finite
  if (typeof maxAttempts !== "number" || !isFinite(maxAttempts)) {
    throw new TypeError("maxAttempts must be a finite number");
  }

  // Validate maxAttempts is integer in [1, 10]
  if (!Number.isInteger(maxAttempts) || maxAttempts < 1 || maxAttempts > 10) {
    throw new RangeError("maxAttempts must be between 1 and 10");
  }

  // Validate initialDelayMs is finite
  if (typeof initialDelayMs !== "number" || !isFinite(initialDelayMs)) {
    throw new TypeError("initialDelayMs must be a finite number");
  }

  // Validate initialDelayMs is positive integer
  if (
    !Number.isInteger(initialDelayMs) ||
    initialDelayMs <= 0
  ) {
    throw new RangeError("initialDelayMs must be a positive integer");
  }

  return (async () => {
    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const result = await (fn as () => Promise<T>)();
        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        // If this is not the last attempt, wait before retrying
        if (attempt < maxAttempts) {
          const delayMs =
            (initialDelayMs as number) * Math.pow(2, attempt - 1);
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
      }
    }

    // All attempts failed, reject with last error
    throw lastError;
  })();
}