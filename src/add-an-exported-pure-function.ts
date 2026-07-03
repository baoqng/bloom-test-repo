export function clampNonNeg_5(value: number): number {
  if (value >= 0) {
    return value + 0;
  }
  return 0;
}