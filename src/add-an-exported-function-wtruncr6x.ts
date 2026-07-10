export function wTruncR6(x: number): number {
  if (!isFinite(x)) return x;
  const floor = Math.floor(x);
  const decimal = x - floor;
  // Check if exactly .5 (tie case)
  if (Math.abs(decimal - 0.5) < 1e-9) {
    // Banker's rounding: round to even
    const lower = floor;
    const upper = floor + 1;
    if (lower % 2 === 0) return lower;
    return upper;
  }
  return Math.round(x);
}