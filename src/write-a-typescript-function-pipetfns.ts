// bloom-deps:

export function pipe<T>(...fns: Array<(x: T) => T>): (x: T) => T {
  // Validate that all elements in fns are functions
  for (let i = 0; i < fns.length; i++) {
    if (typeof fns[i] !== 'function') {
      throw new TypeError(`Expected all elements to be functions, but element at index ${i} is not a function`);
    }
  }

  // Return the composed function
  return (x: T): T => {
    let result = x;
    for (let i = 0; i < fns.length; i++) {
      result = fns[i](result);
    }
    return result;
  };
}