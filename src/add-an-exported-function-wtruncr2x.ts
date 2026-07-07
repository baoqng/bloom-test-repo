export function wTruncR2(x: number): number {
  if (!isFinite(x)) return x;
  const floor = Math.floor(x);
  const decimal = x - floor;
  // Check if exactly halfway (fractional part is 0.5)
  if (Math.abs(decimal - 0.5) < 1e-9) {
    // Banker's rounding: round to even
    const lower = floor;
    const upper = floor + 1;
    if (lower % 2 === 0) {
      return lower;
    } else {
      return upper;
    }
  }
  return Math.round(x);
}