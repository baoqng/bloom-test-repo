function raceWithTimeout<T>(promise: unknown, timeoutMs: unknown, message: unknown): Promise<T> {
  // Validate promise
  if (promise === null || promise === undefined || typeof (promise as any)?.then !== 'function') {
    throw new TypeError('promise must be a thenable');
  }

  // Validate timeoutMs - must be finite number first
  if (typeof timeoutMs !== 'number' || !isFinite(timeoutMs)) {
    throw new TypeError('timeoutMs must be a finite number');
  }

  // Validate timeoutMs - must be positive integer
  if (!Number.isInteger(timeoutMs) || timeoutMs <= 0) {
    throw new RangeError('timeoutMs must be a positive integer');
  }

  // Validate message
  if (typeof message !== 'string') {
    throw new TypeError('message must be a string');
  }

  const thenable = promise as PromiseLike<T>;

  return new Promise<T>((resolve, reject) => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    const cleanup = () => {
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }
    };

    timer = setTimeout(() => {
      cleanup();
      reject(new Error(message as string));
    }, timeoutMs as number);

    const wrappedPromise = Promise.resolve(thenable);

    wrappedPromise
      .then(
        (value) => {
          cleanup();
          resolve(value);
        },
        (err) => {
          cleanup();
          reject(err);
        }
      )
      .catch(() => {});
  });
}

export { raceWithTimeout };