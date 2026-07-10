export function wFloor(x: number): number {
  if (!isFinite(x) || x !== x) return x;
  
  const fractional = x - Math.trunc(x);
  const absFrac = Math.abs(fractional);
  
  // Exact 0.5 tie case: use bankers rounding (round half to even)
  if (Math.abs(absFrac - 0.5) < 1e-15) {
    const lower = Math.floor(x);
    const upper = Math.ceil(x);
    // Pick the even neighbor
    if (lower % 2 === 0) return lower;
    if (upper % 2 === 0) return upper;
    // Both odd shouldn't happen for integers differing by 1, but fallback
    return Math.round(x);
  }
  
  // Non-tie case: standard rounding
  return Math.round(x);
}