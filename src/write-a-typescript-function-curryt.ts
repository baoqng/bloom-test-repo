// bloom-deps:

function curry<T extends (...args: unknown[]) => unknown>(fn: T): unknown {
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }

  const arity = fn.length;

  if (arity === 0) {
    return fn();
  }

  function curried(...args: unknown[]): unknown {
    if (args.length >= arity) {
      return fn(...args);
    }
    return function(...moreArgs: unknown[]): unknown {
      return curried(...args, ...moreArgs);
    };
  }

  return curried;
}

export { curry };