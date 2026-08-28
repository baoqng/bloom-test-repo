// bloom-deps:

export function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  if (typeof ms !== "number" || !Number.isFinite(ms) || !Number.isInteger(ms) || ms <= 0) {
    throw new TypeError("ms must be a finite positive number");
  }

  return new Promise<T>((resolve, reject) => {
    let settled = false;
    let timerId: ReturnType<typeof setTimeout>;

    timerId = setTimeout(() => {
      if (!settled) {
        settled = true;
        clearTimeout(timerId);
        reject(new RangeError(`Operation timed out after ${ms}ms`));
      }
    }, ms);

    promise.then(
      (value) => {
        if (!settled) {
          settled = true;
          clearTimeout(timerId);
          resolve(value);
        }
      },
      (error) => {
        if (!settled) {
          settled = true;
          clearTimeout(timerId);
          reject(error);
        }
      }
    );
  });
}