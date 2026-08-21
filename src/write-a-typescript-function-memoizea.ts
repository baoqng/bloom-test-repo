// bloom-deps:

function memoize<A, R>(fn: (arg: A) => R): (arg: A) => R {
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }

  const cache = new Map<string, R>();

  return function (arg: A): R {
    const key = JSON.stringify(arg);

    if (cache.has(key)) {
      return cache.get(key) as R;
    }

    const result = fn(arg);
    cache.set(key, result);
    return result;
  };
}

export { memoize };