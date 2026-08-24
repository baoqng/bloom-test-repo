// bloom-deps:

async function sleep(ms: number): Promise<void> {
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
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }

  const { maxAttempts, baseDelayMs, maxDelayMs, jitter = false, shouldRetry } = options;

  if (!Number.isInteger(maxAttempts) || maxAttempts < 1) {
    throw new TypeError('maxAttempts must be a positive integer');
  }

  if (typeof baseDelayMs !== 'number' || !isFinite(baseDelayMs) || baseDelayMs <= 0) {
    throw new TypeError('baseDelayMs must be a positive finite number');
  }

  if (typeof maxDelayMs !== 'number' || !isFinite(maxDelayMs) || maxDelayMs <= 0) {
    throw new TypeError('maxDelayMs must be a positive finite number');
  }

  const shouldRetryFn: (error: Error, attempt: number) => boolean =
    typeof shouldRetry === 'function' ? shouldRetry : () => true;

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const result = await fn();
      return result;
    } catch (error) {
      lastError = error;

      const isLastAttempt = attempt === maxAttempts;

      if (isLastAttempt) {
        break;
      }

      const shouldContinue = shouldRetryFn(error as Error, attempt);
      if (!shouldContinue) {
        break;
      }

      let delay = Math.min(baseDelayMs * Math.pow(2, attempt - 1), maxDelayMs);

      if (jitter) {
        const jitterFactor = 0.5 + Math.random() * 0.5;
        delay = delay * jitterFactor;
      }

      await sleep(delay);
    }
  }

  throw lastError;
}