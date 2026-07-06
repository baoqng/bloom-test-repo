export function roundTieEven(x: number): number {
  // Handle special cases
  if (!isFinite(x)) {
    return x;
  }

  // Handle -0 edge case
  if (x === 0) {
    return 0;
  }

  // Get the integer part and fractional part
  const floor = Math.floor(x);
  const frac = x - floor;

  // If not exactly halfway, use standard rounding
  if (Math.abs(frac - 0.5) > 1e-10) {
    const result = Math.round(x);
    // Ensure we never return -0
    return result === 0 ? 0 : result;
  }

  // At exactly 0.5, round to nearest even integer
  // The two candidates are floor and floor+1 (ceil)
  const lo = floor;
  const hi = floor + 1;

  if (lo % 2 === 0) {
    return lo === 0 ? 0 : lo;
  } else if (hi % 2 === 0) {
    return hi === 0 ? 0 : hi;
  } else {
    // Both odd shouldn't happen for consecutive integers, but fallback
    return lo === 0 ? 0 : lo;
  }
}