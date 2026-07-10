export function wTrunc(x: number): number {
  if (!isFinite(x) || x !== x) return x;
  const fraction = x - Math.trunc(x);
  const absFrac = Math.abs(fraction);
  // Check if exactly halfway (fractional part is 0.5)
  if (Math.abs(absFrac - 0.5) < 1e-9) {
    // Banker's rounding: round to even
    const floor = Math.floor(x);
    const ceil = Math.ceil(x);
    // Pick the even one
    if (floor % 2 === 0) return floor;
    return ceil;
  }
  return Math.round(x);
}