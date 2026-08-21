// bloom-deps:

class TimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TimeoutError';
  }
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, message?: string): Promise<T> {
  if (!promise || typeof promise.then !== 'function') {
    throw new TypeError('promise must be a Promise');
  }

  if (typeof timeoutMs !== 'number' || !isFinite(timeoutMs) || timeoutMs <= 0) {
    throw new RangeError('timeoutMs must be a positive finite number');
  }

  const resolvedMessage = typeof message === 'string' ? message : 'Operation timed out';

  return new Promise<T>((resolve, reject) => {
    let settled = false;
    let timerId: ReturnType<typeof setTimeout>;

    timerId = setTimeout(() => {
      if (!settled) {
        settled = true;
        reject(new TimeoutError(resolvedMessage));
      }
    }, timeoutMs);

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
    ).catch(() => {});
  });
}

export { withTimeout, TimeoutError };