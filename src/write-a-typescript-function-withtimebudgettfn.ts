// bloom-deps:

async function withTimeBudget<T>(
  fn: () => Promise<T>,
  budgetMs: unknown,
  delayMs?: unknown
): Promise<T> {
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }
  if (typeof budgetMs !== 'number' || !isFinite(budgetMs)) {
    throw new TypeError('budgetMs must be a finite number');
  }
  if (budgetMs <= 0) {
    throw new RangeError('budgetMs must be a positive number');
  }
  if (delayMs !== undefined) {
    if (typeof delayMs !== 'number' || !isFinite(delayMs)) {
      throw new TypeError('delayMs must be a finite number');
    }
    if (delayMs < 0) {
      throw new RangeError('delayMs must not be negative');
    }
  }

  const resolvedDelay = delayMs !== undefined ? (delayMs as number) : 0;
  const start = Date.now();

  let lastError: unknown;

  while (true) {
    try {
      const result = await fn();
      return result;
    } catch (err) {
      lastError = err;
      const elapsed = Date.now() - start;
      if (elapsed + resolvedDelay > budgetMs) {
        throw lastError;
      }
      // Wait delayMs before retrying
      if (resolvedDelay > 0) {
        await new Promise<void>((resolve) => {
          let settled = false;
          const timer = setTimeout(() => {
            if (!settled) {
              settled = true;
              resolve();
            }
          }, resolvedDelay);
          // Ensure timer doesn't block if something goes wrong
          void timer;
        });
      }
    }
  }
}

export { withTimeBudget };