// bloom-deps:

function chunk<T>(arr: unknown, size: unknown): T[][] {
  if (!Array.isArray(arr)) {
    throw new TypeError(`arr must be an Array`);
  }

  if (typeof size !== 'number' || isNaN(size)) {
    throw new TypeError(`size must be a number`);
  }

  if (!Number.isInteger(size)) {
    throw new TypeError(`size must be an integer`);
  }

  if (size < 1) {
    throw new RangeError(`size must be a positive integer (>= 1)`);
  }

  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push((arr as T[]).slice(i, i + size));
  }
  return result;
}

export { chunk };