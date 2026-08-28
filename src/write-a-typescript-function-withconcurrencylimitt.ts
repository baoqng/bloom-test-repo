// bloom-deps:

export function withConcurrencyLimit<T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  limit: unknown
): (...args: T) => Promise<R> {
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }
  if (typeof limit !== 'number' || !isFinite(limit)) {
    throw new TypeError('limit must be a finite number');
  }
  if (!Number.isInteger(limit) || limit < 1) {
    throw new RangeError('limit must be a positive integer');
  }

  const concurrencyLimit = limit as number;
  let running = 0;
  const queue: Array<() => void> = [];

  return function (...args: T): Promise<R> {
    return new Promise<R>((resolve, reject) => {
      const execute = () => {
        running++;
        fn(...args).then(
          (result) => {
            running--;
            resolve(result);
            if (queue.length > 0) {
              const next = queue.shift()!;
              next();
            }
          },
          (error) => {
            running--;
            reject(error);
            if (queue.length > 0) {
              const next = queue.shift()!;
              next();
            }
          }
        );
      };

      if (running < concurrencyLimit) {
        execute();
      } else {
        queue.push(execute);
      }
    });
  };
}