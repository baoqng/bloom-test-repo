// bloom-deps:

function pipe<T>(...fns: Array<(x: T) => T>): (x: T) => T {
  for (let i = 0; i < fns.length; i++) {
    if (typeof fns[i] !== 'function') {
      throw new TypeError(`Expected a function at index ${i}`);
    }
  }

  if (fns.length === 0) {
    return (x: T): T => x;
  }

  return (x: T): T => {
    let result = x;
    for (const fn of fns) {
      result = fn(result);
    }
    return result;
  };
}

export { pipe };