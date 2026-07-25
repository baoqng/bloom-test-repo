// bloom-deps:

export function sumPositive_9(numbers: Array<number>): number {
  return numbers.reduce((sum, num) => {
    if (num > 0) {
      return sum + num;
    }
    return sum;
  }, 0);
}