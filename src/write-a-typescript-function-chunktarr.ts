// bloom-deps:

function chunk<T>(arr: T[], size: number): T[][] {
  if (!Number.isInteger(size) || size < 1) {
    throw new RangeError('size must be an integer >= 1');
  }

  if (!Array.isArray(arr) || arr.length === 0) {
    return [];
  }

  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

export { chunk };