// bloom-deps:

function chunk<T>(arr: unknown, size: unknown): T[][] {
  if (!Array.isArray(arr)) {
    throw new TypeError('arr must be an Array');
  }

  if (!Number.isInteger(size) || (size as number) < 1) {
    if (typeof size !== 'number' || !Number.isFinite(size as number) || !Number.isInteger(size)) {
      throw new TypeError('size must be a positive integer');
    }
    throw new RangeError('size must be >= 1');
  }

  const n = size as number;
  const result: T[][] = [];

  for (let i = 0; i < arr.length; i += n) {
    result.push((arr as T[]).slice(i, i + n));
  }

  return result;
}

export { chunk };