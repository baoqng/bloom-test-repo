// bloom-deps:

export function lastN_4<T>(arr: T[], n: number): T[] {
  if (n < 0) {
    throw new RangeError('n must be >= 0');
  }
  if (n === 0) {
    return [];
  }
  return arr.slice(arr.length - n < 0 ? 0 : arr.length - n);
}