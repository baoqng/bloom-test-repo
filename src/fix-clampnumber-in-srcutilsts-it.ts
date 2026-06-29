// bloom-deps:

export function clampNumber(value: number | null | undefined, min: number, max: number): number {
  if (value === null || value === undefined) {
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