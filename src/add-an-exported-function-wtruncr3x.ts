export function wTruncR3(x: number): number {
  if (!isFinite(x)) return x;
  if (Number.isInteger(x)) return x;
  const fraction = x - Math.trunc(x);
  const absFrac = Math.abs(fraction);
  // Check if exactly 0.5 (half case) — banker's rounding (round half to even)
  if (Math.abs(absFrac - 0.5) < 1e-9) {
    const floor = Math.floor(x);
    const ceil = Math.ceil(x);
    // Pick the even neighbor
    if (floor % 2 === 0) return floor;
    return ceil;
  }
  // Otherwise, standard rounding
  return Math.round(x);
}