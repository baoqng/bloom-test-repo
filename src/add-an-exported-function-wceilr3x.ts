export function wCeilR3(x: number): number {
  if (!isFinite(x)) return x;
  const rounded = Math.round(x);
  const diff = x - rounded;
  // Check if x is exactly halfway between two integers
  const frac = x - Math.floor(x);
  if (Math.abs(frac - 0.5) < 1e-12) {
    // Tie case: round to even
    const lower = Math.floor(x);
    const upper = lower + 1;
    if (lower % 2 === 0) {
      return lower;
    } else {
      return upper;
    }
  }
  // Non-tie: standard rounding (round to nearest)
  return Math.round(x);
}