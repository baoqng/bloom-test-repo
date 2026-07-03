// bloom-deps:
export function sumPositive_6(numbers: number[]): number {
  return numbers.filter(num => num > 0).reduce((sum, num) => sum + num, 0);
}