// bloom-deps:
export function sumPositive_51(numbers: number[]): number {
  return numbers.filter(n => n > 0).reduce((sum, n) => sum + n, 0);
}