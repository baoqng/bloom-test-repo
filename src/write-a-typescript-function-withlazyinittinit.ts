// bloom-deps:

function withLazyInit<T>(init: () => Promise<T>): () => Promise<T> {
  if (typeof init !== "function") {
    throw new TypeError("init must be a function");
  }

  let cachedPromise: Promise<T> | null = null;

  return (): Promise<T> => {
    if (cachedPromise !== null) {
      return cachedPromise;
    }

    const promise = init().then(
      (value) => {
        // Keep cachedPromise set so future calls return the resolved value
        return value;
      },
      (error) => {
        // On rejection, clear cachedPromise so next call retries
        cachedPromise = null;
        throw error;
      }
    );

    cachedPromise = promise;
    return promise;
  };
}

export { withLazyInit };