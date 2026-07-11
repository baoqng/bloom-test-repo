export function wTrunc(x: number): number {
  if (!isFinite(x) || x !== x) return x;
  const fraction = x - Math.trunc(x);
  const absFrac = Math.abs(fraction);
  // If exactly halfway, round to even (banker's rounding)
  if (Math.abs(absFrac - 0.5) < 1e-9) {
    const floor = Math.floor(x);
    const ceil = Math.ceil(x);
    // Pick the even one
    if (floor % 2 === 0) return floor;
    return ceil;
  }
  // Otherwise, standard rounding
  return Math.round(x);
}