// bloom-deps:

export function sumPositive_61(arr: unknown[]): number {
  if (!Array.isArray(arr)) {
    return 0;
  }

  return arr.reduce((sum: number, item: unknown): number => {
    if (typeof item === 'number' && item > 0) {
      return sum + item;
    }
    return sum;
  }, 0);
}