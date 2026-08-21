// bloom-deps:

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts: number;
    baseDelayMs: number;
    maxDelayMs: number;
    jitter?: boolean;
    retryOn?: (error: Error) => boolean;
  }
): Promise<T> {
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }

  if (
    options === null ||
    typeof options !== 'object' ||
    Object.getPrototypeOf(options) !== Object.prototype
  ) {
    throw new TypeError('options must be a plain object');
  }

  const { maxAttempts, baseDelayMs, maxDelayMs, jitter, retryOn } = options;

  if (!Number.isInteger(maxAttempts) || maxAttempts < 1) {
    throw new RangeError('maxAttempts must be a positive integer');
  }

  if (!Number.isFinite(baseDelayMs) || baseDelayMs <= 0) {
    throw new RangeError('baseDelayMs must be a positive finite number');
  }

  if (!Number.isFinite(maxDelayMs) || maxDelayMs < baseDelayMs) {
    throw new RangeError('maxDelayMs must be a finite number >= baseDelayMs');
  }

  const sleep = (ms: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms));

  let lastError: unknown;

  for (let i = 0; i < maxAttempts; i++) {
    try {
      return await fn() as T;
    } catch (error) {
      lastError = error;

      if (retryOn !== undefined) {
        if (!retryOn(error as Error)) {
          throw error;
        }
      }

      if (i + 1 < maxAttempts) {
        let delay = Math.min(baseDelayMs * Math.pow(2, i), maxDelayMs);
        if (jitter === true) {
          delay = delay + Math.random() * delay;
        }
        await sleep(delay);
      }
    }
  }

  throw lastError;
}

export { retryWithBackoff };