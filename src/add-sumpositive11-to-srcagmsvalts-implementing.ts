// bloom-deps:

export function sumPositive_11(numbers: Array<number>): number {
  if (!Array.isArray(numbers)) {
    return 0;
  }

  return numbers.reduce((sum: number, num: number) => {
    if (typeof num === 'number' && num > 0) {
      return sum + num;
    }
    return sum;
  }, 0);
}