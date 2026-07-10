export function wFloor(x: number): number {
  if (!isFinite(x) || x !== x) return x;
  if (x === 0) return x;

  // Banker's rounding (round-half-to-even)
  const rounded = Math.round(x);
  const diff = x - rounded;

  // Check if x is exactly halfway between two integers
  const frac = x - Math.floor(x);
  const isHalf = Math.abs(frac - 0.5) < 1e-12;

  if (isHalf) {
    // Tie: round to nearest even integer
    const lower = Math.floor(x);
    const upper = Math.ceil(x);
    if (lower % 2 === 0) return lower;
    return upper;
  } else {
    // Not a tie: standard rounding
    return Math.round(x);
  }
}