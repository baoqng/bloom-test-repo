// bloom-deps:

class ServiceError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options as ErrorOptions);
    this.name = 'ServiceError';
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function retryWithBudget<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts: number;
    baseDelayMs: number;
    maxDelayMs: number;
    jitter?: boolean;
    shouldRetry?: (error: Error, attempt: number) => boolean;
  }
): Promise<T> {
  // Validate fn
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }

  // Validate maxAttempts: must be a positive integer
  if (
    typeof options.maxAttempts !== 'number' ||
    !Number.isInteger(options.maxAttempts) ||
    options.maxAttempts <= 0
  ) {
    throw new TypeError('maxAttempts must be a positive integer');
  }

  // Validate baseDelayMs: must be a positive finite number
  if (
    typeof options.baseDelayMs !== 'number' ||
    !Number.isFinite(options.baseDelayMs) ||
    options.baseDelayMs <= 0
  ) {
    throw new TypeError('baseDelayMs must be a positive finite number');
  }

  // Validate maxDelayMs: must be a positive finite number
  if (
    typeof options.maxDelayMs !== 'number' ||
    !Number.isFinite(options.maxDelayMs) ||
    options.maxDelayMs <= 0
  ) {
    throw new TypeError('maxDelayMs must be a positive finite number');
  }

  const { maxAttempts, baseDelayMs, maxDelayMs, jitter = false } = options;
  const shouldRetry = options.shouldRetry ?? (() => true);

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const result = await fn();
      return result;
    } catch (err) {
      lastError = err;

      const isLastAttempt = attempt === maxAttempts;

      if (isLastAttempt) {
        // No delay after final attempt, rethrow as-is
        break;
      }

      // Check if we should retry
      const error = err instanceof Error ? err : new Error(String(err));
      if (!shouldRetry(error, attempt)) {
        break;
      }

      // Compute delay: min(baseDelayMs * 2^(attempt-1), maxDelayMs)
      let delay = Math.min(baseDelayMs * Math.pow(2, attempt - 1), maxDelayMs);

      // Apply jitter: multiply by random value in [0.5, 1.0]
      if (jitter) {
        const jitterFactor = 0.5 + Math.random() * 0.5;
        delay = delay * jitterFactor;
      }

      await sleep(delay);
    }
  }

  // Rethrow the last error as-is
  throw lastError;
}