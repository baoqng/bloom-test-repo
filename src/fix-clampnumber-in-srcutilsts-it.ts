export function clampNumber(value: unknown, min: number, max: number): number {
  if (typeof value !== "number" || isNaN(value)) {
    return min;
  }
  if (value <= min) {
    return min;
  }
  if (value >= max) {
    return max;
  }
  return value;
}