export function withLazyInit<T>(init: () => Promise<T>): () => Promise<T> {
  if (typeof init !== 'function') {
    throw new TypeError('init must be a function');
  }

  let inFlightPromise: Promise<T> | null = null;
  let resolved = false;
  let cachedValue: T;

  return function wrapper(): Promise<T> {
    if (resolved) {
      return Promise.resolve(cachedValue);
    }

    if (inFlightPromise !== null) {
      return inFlightPromise;
    }

    inFlightPromise = init().then(
      (value) => {
        resolved = true;
        cachedValue = value;
        inFlightPromise = null;
        return value;
      },
      (error) => {
        inFlightPromise = null;
        throw error;
      }
    );

    return inFlightPromise;
  };
}