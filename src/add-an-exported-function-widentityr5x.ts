export function wIdentityR5(x: number): number {
  if (!isFinite(x)) return x;
  const rounded = Math.round(x);
  // Check for tie case (exactly halfway between two integers)
  const frac = x - Math.floor(x);
  if (Math.abs(frac - 0.5) < 1e-12 || Math.abs(frac + 0.5) < 1e-12) {
    // Banker's rounding: round to even
    const floor = Math.floor(x);
    const ceil = Math.ceil(x);
    if (floor === ceil) return floor;
    // Pick the even one
    if (floor % 2 === 0) return floor;
    return ceil;
  }
  return rounded;
}