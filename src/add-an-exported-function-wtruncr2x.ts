export function wTruncR2(x: number): number {
  if (!isFinite(x)) return x;
  const rounded = Math.round(x);
  const diff = x - Math.trunc(x);
  const absDiff = Math.abs(diff);
  // Check if exactly halfway
  if (Math.abs(absDiff - 0.5) < 1e-9) {
    // Banker's rounding: round to even
    const floor = Math.trunc(x);
    const ceil = x > 0 ? floor + 1 : floor - 1;
    if (floor % 2 === 0) return floor;
    return ceil;
  }
  return Math.round(x);
}