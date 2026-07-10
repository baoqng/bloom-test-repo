export function wCeil(x: number): number {
  if (!isFinite(x)) return x;
  const rounded = Math.round(x);
  const diff = x - rounded;
  // If x is already an integer, return it
  if (Number.isInteger(x)) return x;
  // Check if x is exactly halfway between two integers
  const floor = Math.floor(x);
  const frac = x - floor;
  const isHalf = Math.abs(frac - 0.5) < 1e-12;
  if (isHalf) {
    // Banker's rounding: round to even
    const lower = floor;
    const upper = floor + 1;
    if (lower % 2 === 0 || lower % 2 === -0) {
      return Math.abs(lower % 2) === 0 ? lower : upper;
    } else {
      return Math.abs(upper % 2) === 0 ? upper : lower;
    }
  }
  // Non-half: round to nearest integer (standard rounding)
  return Math.round(x);
}