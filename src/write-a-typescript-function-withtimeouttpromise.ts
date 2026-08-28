function withTimeout<T>(promise: Promise<T>, timeoutMs: unknown, message: unknown): Promise<T> {
  if (
    typeof timeoutMs !== 'number' ||
    !Number.isInteger(timeoutMs) ||
    timeoutMs <= 0
  ) {
    throw new TypeError('timeoutMs must be a positive integer');
  }

  if (typeof message !== 'string' || message.length === 0) {
    throw new TypeError('message must be a non-empty string');
  }

  const msg = message as string;
  const ms = timeoutMs as number;

  return new Promise<T>((resolve, reject) => {
    let settled = false;
    let timerId: ReturnType<typeof setTimeout>;

    timerId = setTimeout(() => {
      if (!settled) {
        settled = true;
        reject(new Error(msg));
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
      (err) => {
        if (!settled) {
          settled = true;
          clearTimeout(timerId);
          reject(err);
        }
      }
    );
  });
}

export { withTimeout };