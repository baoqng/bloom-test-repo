export function wIdentity(x: number): number {
  if (!isFinite(x)) return x;
  const rounded = Math.round(x);
  const frac = x - Math.trunc(x);
  // Check if exactly halfway
  if (Math.abs(Math.abs(frac) - 0.5) < 1e-9) {
    // Banker's rounding: round to even
    const floor = Math.trunc(x) + (x < 0 && frac !== 0 ? -1 : 0);
    const ceil = floor + 1;
    // Pick the even one
    if (floor % 2 === 0) {
      return floor;
    } else {
      return ceil;
    }
  }
  return rounded;
}