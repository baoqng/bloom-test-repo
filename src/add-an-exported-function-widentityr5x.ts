export function wIdentityR5(x: number): number {
  if (!isFinite(x)) return x;
  const rounded = Math.round(x);
  const diff = x - Math.floor(x);
  // Check if exactly a .5 tie
  if (Math.abs(diff - 0.5) < 1e-9) {
    const floor = Math.floor(x);
    const ceil = Math.ceil(x);
    // Banker's rounding: choose the even one
    if (floor % 2 === 0) {
      return floor;
    } else {
      return ceil;
    }
  }
  return rounded;
}