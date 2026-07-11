export function wIdentityR4(x: number): number {
  if (x === null || x === undefined) {
    return NaN;
  }
  if (!isFinite(x)) {
    return x;
  }
  // Banker's rounding (round half to even)
  const floor = Math.floor(x);
  const decimal = x - floor;
  // Check if exactly at 0.5 tie
  if (Math.abs(decimal - 0.5) < 1e-9) {
    // Round to even
    if (floor % 2 === 0) {
      return floor;
    } else {
      return floor + 1;
    }
  }
  return Math.round(x);
}