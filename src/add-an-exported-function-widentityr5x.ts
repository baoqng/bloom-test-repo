export function wIdentityR5(x: number): number {
  if (!isFinite(x)) return x;
  const rounded = Math.round(x);
  // Check for tie: fractional part is exactly 0.5
  const frac = x - Math.trunc(x);
  if (Math.abs(Math.abs(frac) - 0.5) < 1e-9) {
    // Banker's rounding: round to even
    const floor = Math.floor(x);
    const ceil = Math.ceil(x);
    if (floor % 2 === 0) return floor;
    return ceil;
  }
  return rounded;
}