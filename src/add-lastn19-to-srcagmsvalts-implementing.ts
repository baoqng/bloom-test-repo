export function lastN_19<T>(array: T[], n: number): T[] {
  if (n === null || n === undefined) {
    throw new Error('n must be a number');
  }
  if (n < 0) {
    throw new Error('n must be >= 0');
  }
  if (n === 0) {
    return [];
  }
  return array.slice(-n);
}