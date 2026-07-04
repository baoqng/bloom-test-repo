// bloom-deps:

export function sumPositive_56(numbers: unknown[]): number {
  if (!Array.isArray(numbers)) {
    throw new Error('Input must be an array');
  }

  let sum = 0;
  for (const num of numbers) {
    if (typeof num === 'number' && num > 0) {
      sum += num;
    }
  }
  return sum;
}