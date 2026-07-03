// bloom-deps:

export function lastN_4<T>(arr: T[], n: number): T[] {
  if (n < 0) {
    throw new Error('n must be >= 0');
  }
  if (n === 0) {
    return [];
  }
  const length = arr.length;
  if (n >= length) {
    return arr.slice();
  }
  const offset = length - n;
  return arr.slice(offset, offset + n);
}