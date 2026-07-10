export function wTrunc(x: number): number {
  if (!isFinite(x) || x !== x) return x;
  const fraction = x - Math.trunc(x);
  const absFrac = Math.abs(fraction);
  // If exactly halfway (fractional part is 0.5)
  if (Math.abs(absFrac - 0.5) < 1e-9) {
    // Banker's rounding: round to even
    const low = Math.trunc(x);
    const high = x > 0 ? low + 1 : low - 1;
    // Pick the one that is even
    if (low % 2 === 0) return low;
    return high;
  }
  // Otherwise, standard rounding (round half away from zero is normal Math.round behavior)
  return Math.round(x);
}