// bloom-deps:

function buildRetryConfig(
  maxAttempts: unknown,
  baseDelayMs: unknown,
  maxDelayMs: unknown
): { maxAttempts: number; baseDelayMs: number; maxDelayMs: number; backoffFactor: number } {
  if (typeof maxAttempts !== "number" || !isFinite(maxAttempts)) {
    throw new TypeError("maxAttempts must be a finite number");
  }
  if (typeof baseDelayMs !== "number" || !isFinite(baseDelayMs)) {
    throw new TypeError("baseDelayMs must be a finite number");
  }
  if (typeof maxDelayMs !== "number" || !isFinite(maxDelayMs)) {
    throw new TypeError("maxDelayMs must be a finite number");
  }

  if (!Number.isInteger(maxAttempts) || maxAttempts < 1 || maxAttempts > 10) {
    throw new RangeError("maxAttempts must be an integer between 1 and 10");
  }

  if (baseDelayMs < 10 || baseDelayMs > 30000) {
    throw new RangeError("baseDelayMs must be between 10 and 30000");
  }

  if (maxDelayMs < baseDelayMs) {
    throw new RangeError("maxDelayMs must be >= baseDelayMs");
  }

  return {
    maxAttempts,
    baseDelayMs,
    maxDelayMs,
    backoffFactor: 2,
  };
}

export { buildRetryConfig };