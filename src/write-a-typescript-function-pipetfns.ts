// bloom-deps:

export function pipe<T>(...fns: Array<(arg: T) => T>): (arg: T) => T {
  for (let i = 0; i < fns.length; i++) {
    if (typeof fns[i] !== 'function') {
      throw new TypeError(
        `Argument at index ${i} is not a function; received ${typeof fns[i]}`
      );
    }
  }

  return (arg: T): T => {
    let result = arg;
    for (const fn of fns) {
      result = fn(result);
    }
    return result;
  };
}