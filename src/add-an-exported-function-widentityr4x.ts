export function wIdentityR4(x: number): number {
  if (!isFinite(x)) return x;
  const rounded = Math.round(x);
  const diff = x - Math.trunc(x);
  const absDiff = Math.abs(diff);
  // Check if it's a tie (fractional part is exactly 0.5)
  if (Math.abs(absDiff - 0.5) < 1e-12) {
    // Banker's rounding: round to even
    const floor = Math.trunc(x) + (x < 0 && absDiff > 0 ? -1 : 0);
    const ceil = floor + (x < 0 ? -1 : 1);
    // Pick the even one
    // For positive: floor and ceil are the two candidates
    // For negative: we need to handle sign
    const low = x >= 0 ? Math.floor(x) : Math.ceil(x) - 1;
    const high = low + 1;
    // For negative numbers: e.g. -2.5 -> low=-3, high=-2
    // We want -2 (even), so high
    // e.g. -1.5 -> low=-2, high=-1 -> we want -2 (even), so low
    if (low % 2 === 0) return low;
    return high;
  }
  return Math.round(x);
}