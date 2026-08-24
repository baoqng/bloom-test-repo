// bloom-deps:

export class ServiceError extends Error {
  constructor(message: string, options?: { cause?: Error }) {
    super(message);
    this.name = 'ServiceError';
    if (options?.cause) {
      this.cause = options.cause;
    }
  }
}

export function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  // Input validation: ms must be a finite positive number
  if (typeof ms !== 'number' || !Number.isFinite(ms) || ms <= 0) {
    throw new TypeError('ms must be a finite positive number');
  }

  let timeoutHandle: NodeJS.Timeout | null = null;

  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      timeoutHandle = setTimeout(() => {
        reject(new RangeError(`Operation timed out after ${ms}ms`));
      }, ms);
    }),
  ]).finally(() => {
    // Clear the timeout timer whether the promise wins or loses
    if (timeoutHandle !== null) {
      clearTimeout(timeoutHandle);
    }
  });
}