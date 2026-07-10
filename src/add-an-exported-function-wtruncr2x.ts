export function wTruncR2(x: number): number {
  if (!isFinite(x)) return x;
  const rounded = Math.round(x);
  const frac = x - Math.trunc(x);
  const absFrac = Math.abs(frac);
  // Check if exactly at 0.5 tie
  if (Math.abs(absFrac - 0.5) < 1e-9) {
    // Banker's rounding: round to even
    const floor = Math.trunc(x) + (x < 0 ? -1 : 0);
    const ceil = floor + 1;
    // Pick the candidate closest to x (both are equidistant), prefer even
    const low = x >= 0 ? Math.floor(x) : Math.floor(x);
    const high = low + 1;
    if (low % 2 === 0) return low;
    return high;
  }
  return Math.round(x);
}