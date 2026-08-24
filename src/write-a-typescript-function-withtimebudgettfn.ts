// bloom-deps:

export class ServiceError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = 'ServiceError';
    if (options?.cause) {
      this.cause = options.cause;
    }
  }
}

export async function withTimeBudget<T>(
  fn: unknown,
  budgetMs: unknown,
  delayMs?: unknown
): Promise<T> {
  // Validate fn is a function
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }

  // Validate budgetMs is a finite number
  if (typeof budgetMs !== 'number' || !Number.isFinite(budgetMs)) {
    throw new TypeError('budgetMs must be a finite number');
  }

  // Validate budgetMs is positive
  if (budgetMs <= 0) {
    throw new RangeError('budgetMs must be a positive number');
  }

  // Set default delayMs to 0 if not provided
  let finalDelayMs = 0;
  if (delayMs !== undefined) {
    // Validate delayMs is a finite number when provided
    if (typeof delayMs !== 'number' || !Number.isFinite(delayMs)) {
      throw new TypeError('delayMs must be a finite number');
    }

    // Validate delayMs is not negative
    if (delayMs < 0) {
      throw new RangeError('delayMs must not be negative');
    }

    finalDelayMs = delayMs;
  }

  const startTime = Date.now();
  let lastError: unknown;

  while (true) {
    try {
      // Call fn and return result on success
      const result = await (fn as () => Promise<T>)();
      return result;
    } catch (error) {
      lastError = error;
      
      const elapsedTime = Date.now() - startTime;
      
      // Check if elapsed time plus delay would exceed budget
      if (elapsedTime + finalDelayMs > budgetMs) {
        // Rethrow the last error directly without wrapping
        throw lastError;
      }
      
      // Wait delayMs milliseconds before retrying
      await new Promise((resolve) => setTimeout(resolve, finalDelayMs));
    }
  }
}