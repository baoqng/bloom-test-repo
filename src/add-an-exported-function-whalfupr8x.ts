export function wHalfUpR8(x: number): number {
  if (!Number.isFinite(x)) return x;
  const rounded = Math.round(x);
  // Check if x is exactly at a .5 tie
  const frac = x - Math.trunc(x);
  const absFrac = Math.abs(frac);
  if (Math.abs(absFrac - 0.5) < 1e-12) {
    // Banker's rounding: round to even
    const floor = Math.trunc(x) + (x < 0 && absFrac > 0 ? 0 : 0);
    const low = x > 0 ? Math.floor(x) : Math.ceil(x);
    const high = x > 0 ? Math.ceil(x) : Math.floor(x);
    if (low % 2 === 0) return low;
    if (high % 2 === 0) return high;
    return low;
  }
  return rounded;
}