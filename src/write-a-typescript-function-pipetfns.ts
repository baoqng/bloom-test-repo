// bloom-deps:

function pipe<T>(...fns: Array<(arg: T) => T>): (arg: T) => T {
  if (!Array.isArray(fns)) {
    throw new TypeError('fns must be an array');
  }
  for (let i = 0; i < fns.length; i++) {
    if (typeof fns[i] !== 'function') {
      throw new TypeError(`Element at index ${i} is not a function`);
    }
  }
  return (arg: T): T => {
    return fns.reduce((acc, fn) => fn(acc), arg);
  };
}

export { pipe };