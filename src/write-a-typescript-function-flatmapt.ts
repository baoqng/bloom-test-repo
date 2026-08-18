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
    if (!Array.isArray(mapped)) {
      throw new TypeError(`fn must return an array, but returned ${typeof mapped} at index ${i}`);
    }
    for (let j = 0; j < mapped.length; j++) {
      result.push(mapped[j]);
    }
  }
  return result;
}

export { flatMap };