// bloom-deps:

export function sumPositive_46(array: number[]): number {
  if (!Array.isArray(array)) {
    return 0;
  }
  
  return array.reduce((sum, num) => {
    if (typeof num === 'number' && num > 0) {
      return sum + num;
    }
    return sum;
  }, 0);
}