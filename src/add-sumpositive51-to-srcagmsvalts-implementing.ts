// bloom-deps:

export function sumPositive_51(numbers: unknown[]): number {
  if (!Array.isArray(numbers)) {
    throw new Error('Input must be an array');
  }

  return numbers
    .filter((num): num is number => typeof num === 'number' && !isNaN(num))
    .filter(num => num > 0)
    .reduce((sum, num) => sum + num, 0);
}