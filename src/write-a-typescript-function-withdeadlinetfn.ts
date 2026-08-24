// bloom-deps:

class DeadlineExceededError extends Error {
  constructor(deadlineMs: number) {
    super(`Deadline exceeded after ${deadlineMs}ms`);
    this.name = 'DeadlineExceededError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function withDeadline<T>(fn: () => Promise<T>, deadlineMs: number): Promise<T> {
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }

  if (
    typeof deadlineMs !== 'number' ||
    !Number.isFinite(deadlineMs) ||
    !Number.isInteger(deadlineMs) ||
    deadlineMs <= 0
  ) {
    throw new RangeError('deadlineMs must be a positive finite integer');
  }

  return new Promise<T>((resolve, reject) => {
    let settled = false;
    let timerId: ReturnType<typeof setTimeout> | undefined;

    timerId = setTimeout(() => {
      if (!settled) {
        settled = true;
        reject(new DeadlineExceededError(deadlineMs));
      }
    }, deadlineMs);

    let fnPromise: Promise<T>;
    try {
      fnPromise = fn();
    } catch (err) {
      clearTimeout(timerId);
      settled = true;
      reject(err);
      return;
    }

    fnPromise.then(
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
        // If already settled (deadline fired first), suppress the rejection silently
        // by doing nothing — the promise is already rejected, and we swallow this
        // late rejection to prevent unhandled promise rejection warnings.
      }
    );
  });
}