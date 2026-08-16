// bloom-deps:

export function pipe<T>(...fns: Array<(arg: T) => T>): (arg: T) => T {
  for (let i = 0; i < fns.length; i++) {
    if (typeof fns[i] !== 'function') {
      throw new TypeError(
        `pipe: argument at index ${i} is not a function (got ${typeof fns[i]})`
      );
    }
  }

  return (arg: T): T => {
    let result = arg;
    for (let i = 0; i < fns.length; i++) {
      result = fns[i](result);
    }
    return result;
  };
}