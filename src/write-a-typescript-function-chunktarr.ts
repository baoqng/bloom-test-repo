// bloom-deps:

function chunk<T>(arr: unknown, size: unknown): T[][] {
  if (!Array.isArray(arr)) {
    throw new TypeError(`Expected arr to be an Array, got ${typeof arr}`);
  }

  if (typeof size !== 'number' || !Number.isInteger(size) || size <= 0) {
    if (typeof size !== 'number' || !isFinite(size as number)) {
      throw new TypeError(`Expected size to be a positive integer, got ${typeof size}`);
    }
    throw new RangeError(`Expected size to be at least 1, got ${size}`);
  }

  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push((arr as T[]).slice(i, i + size));
  }
  return result;
}

export { chunk };