// bloom-deps:

function memoize<A, R>(fn: (arg: A) => R): (arg: A) => R {
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }

  const cache = new Map<string, R>();

  return function (arg: A): R {
    let key: string;
    try {
      key = JSON.stringify(arg);
    } catch (e) {
      if (e instanceof SyntaxError) {
        throw e;
      }
      throw new SyntaxError('Failed to serialize argument: ' + String(e));
    }

    if (cache.has(key)) {
      return cache.get(key) as R;
    }

    const result = fn(arg);
    cache.set(key, result);
    return result;
  };
}

export { memoize };