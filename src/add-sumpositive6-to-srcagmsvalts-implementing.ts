// bloom-deps:

export function sumPositive_6(numbers: unknown[]): number {
  if (!Array.isArray(numbers)) {
    return 0;
  }

  return numbers.reduce((sum, num) => {
    if (typeof num === 'number' && num > 0) {
      return sum + num;
    }
    return sum;
  }, 0);
}