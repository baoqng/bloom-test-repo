export function maxOf_6(numbers: number[]): number {
  if (numbers.length === 0) {
    throw new Error('Array must be non-empty');
  }
  let max = numbers[0];
  for (let i = 1; i < numbers.length; i++) {
    const current = numbers[i];
    if (typeof current === 'number' && current > max) {
      max = current;
    }
  }
  // Normalize -0 to +0
  if (max === 0) {
    max = 0;
  }
  return max;
}