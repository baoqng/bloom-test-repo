// bloom-deps:

export function clampInclusiveV7(value: number, min: number, max: number): number {
  if (min > max) {
    throw new RangeError('min must be <= max');
  }
  
  if (value < min) {
    return min;
  }
  
  if (value > max) {
    return max;
  }
  
  return value;
}