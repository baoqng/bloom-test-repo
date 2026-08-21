// bloom-deps:

class TimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TimeoutError';
  }
}

function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  message: string = 'Operation timed out'
): Promise<T> {
  if (!promise || typeof promise.then !== 'function') {
    throw new TypeError('promise must be a Promise');
  }

  if (typeof timeoutMs !== 'number' || !isFinite(timeoutMs) || timeoutMs <= 0) {
    throw new RangeError('timeoutMs must be a positive finite number');
  }

  let timerId: ReturnType<typeof setTimeout> | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timerId = setTimeout(() => {
      reject(new TimeoutError(message));
    }, timeoutMs);
  });

  try {
    const result = Promise.race([promise, timeoutPromise]);
    return result.then(
      (value) => {
        clearTimeout(timerId);
        return value;
      },
      (err) => {
        clearTimeout(timerId);
        throw err;
      }
    );
  } catch (err) {
    clearTimeout(timerId);
    throw err;
  }
}

export { withTimeout, TimeoutError };