export function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  if (typeof ms !== 'number' || !Number.isFinite(ms) || ms <= 0) {
    throw new TypeError(`ms must be a finite positive number, got ${ms}`);
  }

  return new Promise<T>((resolve, reject) => {
    let timerId: ReturnType<typeof setTimeout> | null = null;

    const cleanup = () => {
      if (timerId !== null) {
        clearTimeout(timerId);
      }
    };

    timerId = setTimeout(() => {
      cleanup();
      reject(new RangeError(`Operation timed out after ${ms}ms`));
    }, ms);

    promise.then(
      (value) => {
        cleanup();
        resolve(value);
      },
      (error) => {
        cleanup();
        reject(error);
      }
    );
  });
}