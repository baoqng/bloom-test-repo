export function wTruncR2(x: number): number {
  if (!isFinite(x)) return x;
  const fraction = x - Math.trunc(x);
  const absFrac = Math.abs(fraction);
  const eps = 1e-9;
  // Check if exactly halfway (fractional part is 0.5)
  if (Math.abs(absFrac - 0.5) < eps) {
    // Banker's rounding: round to even
    const lower = Math.trunc(x);
    const upper = x > 0 ? lower + 1 : lower - 1;
    // Pick the even one
    if (lower % 2 === 0) return lower;
    return upper;
  }
  // Otherwise, standard rounding
  return Math.round(x);
}