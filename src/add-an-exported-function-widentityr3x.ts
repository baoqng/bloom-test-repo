export function wIdentityR3(x: number): number {
  if (!Number.isFinite(x)) return x;
  const rounded = Math.round(x);
  const diff = x - Math.floor(x);
  // Check if it's exactly a .5 tie
  if (Math.abs(diff - 0.5) < 1e-14) {
    const floor = Math.floor(x);
    const ceil = Math.ceil(x);
    // Banker's rounding: pick the even one
    if (floor % 2 === 0) return floor;
    return ceil;
  }
  return rounded;
}