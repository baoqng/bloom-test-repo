// bloom-deps:

class TimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TimeoutError';
    Object.setPrototypeOf(this, TimeoutError.prototype);
  }
}

async function promiseTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  message?: string
): Promise<T> {
  if (
    promise === null ||
    typeof promise !== 'object' ||
    typeof (promise as any).then !== 'function'
  ) {
    throw new TypeError('promise must be a Promise');
  }

  if (
    typeof timeoutMs !== 'number' ||
    isNaN(timeoutMs) ||
    !isFinite(timeoutMs) ||
    timeoutMs <= 0
  ) {
    throw new TypeError('timeoutMs must be a positive finite number');
  }

  const errorMessage =
    typeof message === 'string' && message.length > 0
      ? message
      : 'Operation timed out';

  const timeoutPromise = new Promise<never>((_, reject) => {
    const timer = setTimeout(() => {
      reject(new TimeoutError(errorMessage));
    }, timeoutMs);

    if (typeof timer === 'object' && timer !== null && typeof (timer as any).unref === 'function') {
      (timer as any).unref();
    }
  });

  return Promise.race([promise, timeoutPromise]);
}

export { promiseTimeout, TimeoutError };