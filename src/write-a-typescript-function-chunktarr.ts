// bloom-deps:

function chunk<T>(arr: unknown, size: unknown): T[][] {
  if (!Array.isArray(arr)) {
    throw new TypeError(`arr must be an Array, received: ${typeof arr}`);
  }

  if (typeof size !== 'number' || !Number.isInteger(size)) {
    throw new TypeError(`size must be a positive integer, received: ${size}`);
  }

  if (size < 1) {
    throw new RangeError(`size must be >= 1, received: ${size}`);
  }

  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push((arr as T[]).slice(i, i + size));
  }

  return result;
}

export { chunk };