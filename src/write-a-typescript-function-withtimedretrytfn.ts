// bloom-deps:

async function withTimedRetry<T>(fn: () => Promise<T>, budgetMs: unknown, delayMs: unknown): Promise<T> {
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }

  if (typeof budgetMs !== 'number' || !isFinite(budgetMs)) {
    throw new TypeError('budgetMs must be a finite number');
  }

  if (!Number.isInteger(budgetMs) || budgetMs <= 0) {
    throw new RangeError('budgetMs must be a positive integer');
  }

  if (typeof delayMs !== 'number' || !isFinite(delayMs)) {
    throw new TypeError('delayMs must be a finite number');
  }

  if (!Number.isInteger(delayMs) || delayMs < 0) {
    throw new RangeError('delayMs must be a non-negative integer');
  }

  const start = Date.now();
  let lastError: unknown;

  while (true) {
    try {
      const result = await fn();
      return result;
    } catch (err) {
      lastError = err;
      const elapsed = Date.now() - start;
      if (elapsed + delayMs >= budgetMs) {
        throw lastError;
      }
      await new Promise<void>(resolve => setTimeout(resolve, delayMs));
    }
  }
}

export { withTimedRetry };