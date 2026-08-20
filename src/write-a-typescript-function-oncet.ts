// bloom-deps:

function once<T extends (...args: unknown[]) => unknown>(fn: T): T {
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }

  let called = false;
  let cachedResult: unknown;

  return function (this: unknown, ...args: unknown[]) {
    if (!called) {
      called = true;
      cachedResult = fn.apply(this, args);
    }
    return cachedResult;
  } as T;
}

export { once };