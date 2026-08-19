// bloom-deps:

function chunk<T>(arr: T[], size: number): T[][] {
  if (!Array.isArray(arr)) {
    throw new TypeError('arr must be an Array');
  }

  if (!Number.isInteger(size) || isNaN(size) || !isFinite(size)) {
    throw new TypeError('size must be a positive integer');
  }

  if (size < 1) {
    throw new RangeError('size must be >= 1');
  }

  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

export { chunk };