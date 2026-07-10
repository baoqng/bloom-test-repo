export function wCeil(x: number): number {
  if (!isFinite(x)) return x;
  const rounded = Math.round(x);
  const diff = x - rounded;
  // If x is exactly halfway between two integers
  if (Math.abs(Math.abs(diff) - 0.5) < 1e-12) {
    // Round half to even (banker's rounding)
    const floor = Math.floor(x);
    const ceil = Math.ceil(x);
    if (floor % 2 === 0) return floor;
    return ceil;
  }
  // For non-tie cases, round to nearest integer
  return Math.round(x);
}