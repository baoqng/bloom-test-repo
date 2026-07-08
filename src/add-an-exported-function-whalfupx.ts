export function wHalfUp(x: number): number {
  if (!isFinite(x)) return x;
  const rounded = Math.round(x);
  // Check if x is exactly halfway (fractional part is 0.5)
  const frac = x - Math.trunc(x);
  if (Math.abs(Math.abs(frac) - 0.5) < 1e-14) {
    // Banker's rounding: round to even
    const floor = Math.floor(x);
    const ceil = Math.ceil(x);
    if (floor % 2 === 0) return floor;
    if (ceil % 2 === 0) return ceil;
    return rounded;
  }
  return rounded;
}