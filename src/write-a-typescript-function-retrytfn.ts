// bloom-deps:

async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number,
  delayMs: number
): Promise<T> {
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }
  if (!Number.isInteger(maxAttempts) || maxAttempts < 1) {
    throw new TypeError('maxAttempts must be a positive integer');
  }
  if (typeof delayMs !== 'number' || isNaN(delayMs) || delayMs < 0) {
    throw new TypeError('delayMs must be a non-negative number');
  }

  let lastError: unknown;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (e) {
      lastError = e;
      if (attempt < maxAttempts - 1) {
        await new Promise(r => setTimeout(r, delayMs));
      }
    }
  }

  throw lastError;
}

export { retry };