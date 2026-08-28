// bloom-deps:

async function applyExponentialBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: unknown,
  initialDelayMs: unknown,
  factor: unknown
): Promise<T> {
  if (
    typeof maxRetries !== 'number' ||
    !Number.isInteger(maxRetries) ||
    maxRetries < 0
  ) {
    throw new TypeError('maxRetries must be a non-negative integer');
  }

  if (
    typeof initialDelayMs !== 'number' ||
    !Number.isInteger(initialDelayMs) ||
    initialDelayMs <= 0
  ) {
    throw new TypeError('initialDelayMs must be a positive integer');
  }

  if (typeof factor !== 'number' || factor <= 1) {
    throw new TypeError('factor must be a number greater than 1');
  }

  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await fn();
      return result;
    } catch (err) {
      lastError = err;
      if (attempt < maxRetries) {
        const delay = initialDelayMs * Math.pow(factor, attempt);
        await new Promise<void>((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

export { applyExponentialBackoff };