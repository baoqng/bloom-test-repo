export function maxOf_14(numbers: number[]): number {
  if (numbers.length === 0) {
    throw new Error('Array must be non-empty');
  }
  
  let max = numbers[0];
  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] > max || isNaN(max)) {
      max = numbers[i];
    }
  }
  return max;
}