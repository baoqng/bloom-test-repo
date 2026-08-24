export class ServiceError extends Error {
  constructor(message: string, options?: { cause?: Error }) {
    super(message);
    this.name = 'ServiceError';
    if (options?.cause) {
      this.cause = options.cause;
    }
  }
}

export function withBulkhead<T>(
  fn: () => Promise<T>,
  maxConcurrent: number
): () => Promise<T> {
  // Validate fn parameter
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }

  // Validate maxConcurrent parameter
  if (
    typeof maxConcurrent !== 'number' ||
    !Number.isFinite(maxConcurrent) ||
    !Number.isInteger(maxConcurrent) ||
    maxConcurrent <= 0
  ) {
    throw new RangeError('maxConcurrent must be a positive finite integer');
  }

  let inFlightCount = 0;

  return (): Promise<T> => {
    // Check if we're at the limit
    if (inFlightCount >= maxConcurrent) {
      return Promise.reject(
        new RangeError(`Bulkhead limit of ${maxConcurrent} exceeded`)
      );
    }

    // Increment in-flight counter
    inFlightCount++;

    // Call fn and get its promise
    const promise = fn();

    // Attach cleanup to the promise without wrapping it in a new promise
    promise.then(
      () => { inFlightCount--; },
      () => { inFlightCount--; }
    );

    // Return the original promise (same reference)
    return promise;
  };
}