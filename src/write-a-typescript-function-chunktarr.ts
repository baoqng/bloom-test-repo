// bloom-deps:

function chunk<T>(arr: unknown, size: unknown): T[][] {
  if (!Array.isArray(arr)) {
    throw new TypeError('arr must be an Array');
  }

  if (!Number.isInteger(size) || (size as number) < 1) {
    if (typeof size !== 'number' || !Number.isFinite(size) || !Number.isInteger(size)) {
      throw new TypeError('size must be a positive integer');
    }
    throw new RangeError('size must be >= 1');
  }

  const s = size as number;
  const result: T[][] = [];

  for (let i = 0; i < (arr as T[]).length; i += s) {
    result.push((arr as T[]).slice(i, i + s));
  }

  return result;
}

export { chunk };