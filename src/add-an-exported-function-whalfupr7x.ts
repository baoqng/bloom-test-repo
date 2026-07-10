export function wHalfUpR7(x: number): number {
  if (!isFinite(x)) return x;
  const rounded = Math.round(x);
  // Check if x is exactly halfway between two integers
  const frac = x - Math.floor(x);
  if (frac === 0.5) {
    // Round to even
    const floor = Math.floor(x);
    const ceil = Math.ceil(x);
    // Pick the even one
    if (floor % 2 === 0) return floor;
    return ceil;
  }
  if (frac === 0 && x < 0) {
    return x;
  }
  // For negative half cases: e.g. -1.5 -> Math.floor is -2, frac = -1.5 - (-2) = 0.5 — already handled above
  // But let's handle negative numbers more carefully
  // For negative numbers, frac via (x - Math.floor(x)) will be 0.5 for -1.5 (floor=-2, -1.5-(-2)=0.5)
  // So the above check should work. Let's just return the normal round.
  return rounded;
}