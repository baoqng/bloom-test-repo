export function clampNumber(value: number, min: number, max: number): number {
  if (min === max) {
    return min === 0 ? 0 : min;
  }
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
}