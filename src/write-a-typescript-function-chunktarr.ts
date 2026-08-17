// bloom-deps:

function chunk<T>(arr: unknown, size: unknown): T[][] {
  if (!Array.isArray(arr)) {
    throw new TypeError(`Expected arr to be an Array, but received ${arr === null ? 'null' : typeof arr}`);
  }

  if (typeof size !== 'number' || !Number.isFinite(size) || !Number.isInteger(size)) {
    throw new TypeError(`Expected size to be an integer, but received ${size === null ? 'null' : typeof size}`);
  }

  if (size < 1) {
    throw new RangeError(`Expected size to be >= 1, but received ${size}`);
  }

  const result: T[][] = [];
  const typedArr = arr as T[];

  for (let i = 0; i < typedArr.length; i += size) {
    result.push(typedArr.slice(i, i + size));
  }

  return result;
}

export { chunk };