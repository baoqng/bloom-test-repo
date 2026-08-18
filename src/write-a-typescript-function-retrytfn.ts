// bloom-deps:

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number,
  delayMs: number
): Promise<T> {
  if (typeof fn !== 'function') throw new TypeError('fn must be a function');
  if (!Number.isInteger(maxAttempts) || maxAttempts <= 0)
    throw new TypeError('maxAttempts must be a positive integer');
  if (typeof delayMs !== 'number' || isNaN(delayMs) || delayMs < 0)
    throw new TypeError('delayMs must be a non-negative number');

  let lastError: unknown;
  for (let i = 0; i < maxAttempts; i++) {
    try {
      return await fn();
    } catch (e) {
      lastError = e;
      if (i < maxAttempts - 1) await delay(delayMs);
    }
  }
  throw lastError;
}

export { retry };