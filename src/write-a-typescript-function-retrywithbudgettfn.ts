// bloom-deps:

async function retryWithBudget<T>(
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

  if (typeof baseDelayMs !== 'number' || !Number.isFinite(baseDelayMs) || baseDelayMs <= 0) {
    throw new TypeError('baseDelayMs must be a positive finite number');
  }

  if (typeof maxDelayMs !== 'number' || !Number.isFinite(maxDelayMs) || maxDelayMs <= 0) {
    throw new TypeError('maxDelayMs must be a positive finite number');
  }

  const shouldRetryFn = typeof shouldRetry === 'function' ? shouldRetry : () => true;

  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err as Error;

      const isLastAttempt = attempt === maxAttempts;

      if (isLastAttempt) {
        break;
      }

      const retry = shouldRetryFn(lastError, attempt);
      if (!retry) {
        break;
      }

      let delay = Math.min(baseDelayMs * Math.pow(2, attempt - 1), maxDelayMs);

      if (jitter) {
        const factor = 0.5 + Math.random() * 0.5;
        delay = delay * factor;
      }

      await new Promise<void>((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

export { retryWithBudget };