export function maxOf_6(numbers: number[]): number {
  if (numbers.length === 0) {
    throw new Error('Array must not be empty');
  }
  
  let max = numbers[0];
  for (let i = 1; i < numbers.length; i++) {
    if (Number.isNaN(numbers[i])) {
      return NaN;
    }
    if (numbers[i] > max) {
      max = numbers[i];
    }
  }
  
  if (Number.isNaN(max)) {
    return NaN;
  }
  
  return max;
}