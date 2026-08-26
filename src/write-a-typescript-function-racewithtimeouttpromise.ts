export function raceWithTimeout<T>(
  promise: unknown,
  timeoutMs: unknown,
  message: unknown
): Promise<T> {
  // Validate promise
  if (promise === null || typeof (promise as any)?.then !== "function") {
    throw new TypeError("promise must be a thenable");
  }

  // Validate timeoutMs is a finite number
  if (typeof timeoutMs !== "number" || !isFinite(timeoutMs)) {
    throw new TypeError("timeoutMs must be a finite number");
  }

  // Validate timeoutMs is a positive integer
  if (!Number.isInteger(timeoutMs) || timeoutMs <= 0) {
    throw new RangeError("timeoutMs must be a positive integer");
  }

  // Validate message
  if (typeof message !== "string") {
    throw new TypeError("message must be a string");
  }

  const thenable = promise as PromiseLike<T>;

  return new Promise<T>((resolve, reject) => {
    let settled = false;
    let timerId: ReturnType<typeof setTimeout>;

    const cleanup = () => {
      clearTimeout(timerId);
    };

    timerId = setTimeout(() => {
      if (!settled) {
        settled = true;
        cleanup();
        reject(new Error(message as string));
      }
    }, timeoutMs as number);

    // Attach catch before race to swallow late rejections
    const wrappedPromise = Promise.resolve(thenable);
    wrappedPromise.catch(() => {});

    wrappedPromise.then(
      (value) => {
        if (!settled) {
          settled = true;
          cleanup();
          resolve(value);
        }
      },
      (err) => {
        if (!settled) {
          settled = true;
          cleanup();
          reject(err);
        }
      }
    );
  });
}