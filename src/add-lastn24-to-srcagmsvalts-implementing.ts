export function lastN_24<T>(arr: T[], n: number): T[] {
  if (n === null || n === undefined) {
    throw new Error('n must be a number');
  }
  if (n < 0) {
    throw new Error('n must be >= 0');
  }
  if (n === 0) {
    return [];
  }
  return arr.slice(-n);
}