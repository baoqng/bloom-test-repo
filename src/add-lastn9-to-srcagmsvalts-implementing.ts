// bloom-deps:

export function lastN_9<T>(array: T[], n: number): T[] {
  if (n < 0) {
    throw new Error('n must be >= 0');
  }
  if (n === 0) {
    return [];
  }
  return array.slice(-n);
}