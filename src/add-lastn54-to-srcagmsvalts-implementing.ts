// bloom-deps:

export function lastN_54<T>(arr: T[], n: number): T[] {
  if (n < 0) {
    throw new Error('n must be >= 0');
  }
  if (n === 0) {
    return [];
  }
  return arr.slice(-n);
}