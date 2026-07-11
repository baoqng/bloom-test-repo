export function wCeilR2(x: number): number {
  if (!isFinite(x)) return x;
  const rounded = Math.round(x);
  const diff = x - Math.floor(x);
  // Check if it's a exact .5 tie
  if (Math.abs(diff - 0.5) < 1e-12) {
    // Banker's rounding: round to even
    const floor = Math.floor(x);
    const ceil = Math.ceil(x);
    if (floor % 2 === 0) return floor;
    return ceil;
  }
  // Non-tie: standard rounding (round to nearest integer, like Math.round but for non-ties we need normal rounding)
  return Math.round(x);
}