export function wFloorR6(x: number): number {
  if (Number.isInteger(x)) return x;
  const fraction = x - Math.trunc(x);
  const absFrac = Math.abs(fraction);
  // Check if exactly halfway (x.5)
  if (Math.abs(absFrac - 0.5) < 1e-12) {
    // Banker's rounding: round to even
    const lower = Math.trunc(x);
    const upper = x > 0 ? lower + 1 : lower - 1;
    // Pick the even one
    if (lower % 2 === 0) return lower;
    return upper;
  }
  // Otherwise, standard rounding (round half away from zero equivalent, but since not half, just round normally)
  return Math.round(x);
}