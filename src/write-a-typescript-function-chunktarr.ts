// bloom-deps:

export function chunk<T>(arr: T[], size: number): T[][] {
  if (size < 1) {
    throw new RangeError('size must be greater than or equal to 1');
  }

  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}