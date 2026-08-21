// bloom-deps:

export async function withRetryAsync<T>(
  fn: () => Promise<T>,
  maxAttempts: number,
  delayMs: number
): Promise<T> {
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }

  if (
    typeof maxAttempts !== 'number' ||
    !Number.isInteger(maxAttempts) ||
    maxAttempts < 1
  ) {
    throw new RangeError('maxAttempts must be a positive integer');
  }

  if (
    typeof delayMs !== 'number' ||
    !Number.isFinite(delayMs) ||
    delayMs < 0
  ) {
    throw new RangeError('delayMs must be a non-negative finite number');
  }

  let lastErr: unknown;

  for (let i = 0; i < maxAttempts; i++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      if (i < maxAttempts - 1) {
        await new Promise<void>(r => setTimeout(r, delayMs));
      }
    }
  }

  throw lastErr;
}