// bloom-deps:

function chunk<T>(arr: unknown, size: unknown): T[][] {
  if (!Array.isArray(arr)) {
    throw new TypeError(`arr must be an Array`);
  }

  if (typeof size !== 'number' || isNaN(size) || !Number.isInteger(size)) {
    throw new TypeError(`size must be an integer`);
  }

  if (size < 1) {
    throw new RangeError(`size must be a positive integer, got ${size}`);
  }

  const result: T[][] = [];
  const typedArr = arr as T[];

  for (let i = 0; i < typedArr.length; i += size) {
    result.push(typedArr.slice(i, i + size));
  }

  return result;
}

export { chunk };