// bloom-deps:

function chunk<T>(arr: unknown, size: unknown): T[][] {
  if (!Array.isArray(arr)) {
    throw new TypeError(`Expected arr to be an Array, but got ${typeof arr}`);
  }

  if (typeof size !== 'number' || !Number.isInteger(size) || isNaN(size)) {
    throw new TypeError(`Expected size to be an integer, but got ${typeof size}`);
  }

  if (size < 1) {
    throw new RangeError(`Expected size to be at least 1, but got ${size}`);
  }

  const result: T[][] = [];
  const typedArr = arr as T[];

  for (let i = 0; i < typedArr.length; i += size) {
    result.push(typedArr.slice(i, i + size));
  }

  return result;
}

export { chunk };