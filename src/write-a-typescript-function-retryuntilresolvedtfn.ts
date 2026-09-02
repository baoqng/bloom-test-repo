// bloom-deps:

async function retryUntilResolved<T>(
  fn: () => Promise<T>,
  predicate: (result: T) => boolean,
  maxAttempts: number,
  intervalMs: number
): Promise<T> {
  if (
    typeof maxAttempts !== 'number' ||
    !Number.isInteger(maxAttempts) ||
    maxAttempts <= 0
  ) {
    throw new TypeError('maxAttempts must be a positive integer');
  }

  if (
    typeof intervalMs !== 'number' ||
    !Number.isInteger(intervalMs) ||
    intervalMs < 0
  ) {
    throw new TypeError('intervalMs must be a non-negative integer');
  }

  const delay = (ms: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms));

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const result = await fn();

    if (predicate(result)) {
      return result;
    }

    if (attempt < maxAttempts - 1) {
      await delay(intervalMs);
    }
  }

  throw new Error('Condition not met after max attempts');
}

export { retryUntilResolved };