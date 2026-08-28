// bloom-deps:

function chunkArray<T>(arr: T[], size: number): T[][] {
  if (!Array.isArray(arr)) {
    throw new TypeError("arr must be an Array");
  }
  if (typeof size !== "number" || !Number.isFinite(size)) {
    throw new TypeError("size must be a finite number");
  }
  if (!Number.isInteger(size) || size <= 0) {
    throw new RangeError("size must be a positive integer");
  }
  if (arr.length === 0) {
    return [];
  }
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

export { chunkArray };