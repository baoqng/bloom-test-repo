// bloom-deps:

export function pipe<T>(...fns: Array<(arg: T) => T>): (arg: T) => T {
  for (let i = 0; i < fns.length; i++) {
    if (typeof fns[i] !== 'function') {
      throw new TypeError(`Argument at index ${i} is not a function`);
    }
  }

  return (arg: T): T => {
    return fns.reduce((acc, fn) => fn(acc), arg);
  };
}