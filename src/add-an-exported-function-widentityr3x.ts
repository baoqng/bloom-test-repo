export function wIdentityR3(x: number): number {
  if (!isFinite(x)) return x;
  const rounded = Math.round(x);
  // Check for tie (fractional part is exactly 0.5)
  const frac = x - Math.trunc(x);
  if (Math.abs(Math.abs(frac) - 0.5) < 1e-12) {
    // Banker's rounding: round to even
    const floor = Math.trunc(x) + (x < 0 && frac !== 0 ? 0 : 0);
    const low = x >= 0 ? Math.floor(x) : Math.ceil(x);
    const high = x >= 0 ? Math.ceil(x) : Math.floor(x);
    if (low % 2 === 0) return low;
    return high;
  }
  return Math.round(x);
}