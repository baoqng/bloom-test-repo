// bloom-deps:

function buildPromiseQueue(concurrency: unknown): { add: <T>(fn: () => Promise<T>) => Promise<T>; size: () => number } {
  if (typeof concurrency !== 'number' || !isFinite(concurrency) || isNaN(concurrency)) {
    throw new TypeError("concurrency must be a finite number");
  }
  if (!Number.isInteger(concurrency) || concurrency < 1) {
    throw new RangeError("concurrency must be a positive integer");
  }

  const limit = concurrency as number;
  let inFlight = 0;
  const queue: Array<() => void> = [];

  function run(): void {
    while (inFlight < limit && queue.length > 0) {
      const next = queue.shift()!;
      inFlight++;
      next();
    }
  }

  function add<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const task = () => {
        const p = fn();
        p.catch(() => {});
        p.then(
          (value) => {
            inFlight--;
            resolve(value);
            run();
          },
          (err) => {
            inFlight--;
            reject(err);
            run();
          }
        );
      };
      queue.push(task);
      run();
    });
  }

  function size(): number {
    return queue.length;
  }

  return { add, size };
}

export { buildPromiseQueue };