// bloom-deps:

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  if (typeof ms !== 'number' || isNaN(ms) || !isFinite(ms) || ms <= 0) {
    throw new TypeError('ms must be a positive number');
  }

  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Timed out after ${ms}ms`));
    }, ms);

    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}

export { withTimeout };