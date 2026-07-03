// bloom-deps:

export function lastN_9<T>(arr: T[], n: number): T[] {
  if (n < 0) {
    throw new Error('n must be >= 0');
  }
  if (n === 0) {
    return [];
  }
  const offset = Math.max(0, arr.length - n);
  return arr.slice(offset);
}