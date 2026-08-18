// bloom-deps:

function flatMap<T, U>(arr: T[], fn: (item: T, index: number) => U[]): U[] {
  if (!Array.isArray(arr)) {
    throw new TypeError('arr must be an Array');
  }
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }

  const result: U[] = [];
  for (let i = 0; i < arr.length; i++) {
    const mapped = fn(arr[i], i);
    if (Array.isArray(mapped)) {
      for (let j = 0; j < mapped.length; j++) {
        result.push(mapped[j]);
      }
    } else {
      result.push(mapped as unknown as U);
    }
  }
  return result;
}

export { flatMap };