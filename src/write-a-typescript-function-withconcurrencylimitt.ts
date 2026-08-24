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

export function withConcurrencyLimit<T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  limit: unknown
): (...args: T) => Promise<R> {
  // Validate fn is a function
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }

  // Validate limit is a finite number
  if (typeof limit !== 'number' || !Number.isFinite(limit)) {
    throw new TypeError('limit must be a finite number');
  }

  // Validate limit is a positive integer
  if (!Number.isInteger(limit) || limit <= 0) {
    throw new RangeError('limit must be a positive integer');
  }

  let running = 0;
  const queue: Array<{
    args: T;
    resolve: (value: R) => void;
    reject: (reason?: unknown) => void;
  }> = [];

  const processQueue = async () => {
    while (queue.length > 0 && running < limit) {
      const item = queue.shift();
      if (!item) break;

      running++;
      try {
        const result = await fn(...item.args);
        item.resolve(result);
      } catch (error) {
        item.reject(error);
      } finally {
        running--;
        processQueue();
      }
    }
  };

  return (...args: T): Promise<R> => {
    return new Promise<R>((resolve, reject) => {
      if (running < limit) {
        running++;
        fn(...args)
          .then((result) => {
            resolve(result);
          })
          .catch((error) => {
            reject(error);
          })
          .finally(() => {
            running--;
            processQueue();
          });
      } else {
        queue.push({ args, resolve, reject });
      }
    });
  };
}