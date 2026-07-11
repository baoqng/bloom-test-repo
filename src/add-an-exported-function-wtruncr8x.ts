export function wTruncR8(x: number): number {
  if (!isFinite(x)) return x;
  const floor = Math.floor(x);
  const frac = x - floor;
  // Check if exactly halfway
  if (Math.abs(frac - 0.5) < 1e-9) {
    // Banker's rounding: round to even
    const lower = floor;
    const upper = floor + 1;
    if (lower % 2 === 0) return lower;
    return upper;
  }
  return Math.round(x);
}