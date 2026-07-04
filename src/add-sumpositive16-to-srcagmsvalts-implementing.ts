// bloom-deps:

export function sumPositive_16(arr: number[]): number {
  if (!Array.isArray(arr)) {
    return 0;
  }
  
  return arr.filter(num => num > 0).reduce((sum, num) => sum + num, 0);
}