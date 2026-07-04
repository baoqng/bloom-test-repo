// bloom-deps:
export function sumPositive_1(numbers: number[]): number {
  return numbers.filter(n => n > 0).reduce((acc, n) => acc + n, 0);
}