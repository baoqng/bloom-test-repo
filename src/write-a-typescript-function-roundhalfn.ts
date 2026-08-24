// bloom-deps:

export function roundHalf(n: number): number {
  // Input validation
  if (typeof n !== 'number') {
    throw new TypeError('Input must be a number');
  }

  if (!Number.isFinite(n)) {
    throw new Error('Input must be a finite number');
  }

  // Get the integer and fractional parts
  const floor = Math.floor(n);
  const fract = n - floor;

  // Handle exact ties (half-to-even / banker's rounding)
  if (fract === 0.5) {
    // Round to the nearest even integer
    return floor % 2 === 0 ? floor : floor + 1;
  }

  // For negative numbers, we need to handle the fractional part carefully
  if (fract === -0.5) {
    // For negative ties, round to nearest even
    const ceil = Math.ceil(n);
    return ceil % 2 === 0 ? ceil : ceil - 1;
  }

  // Standard rounding: round to nearest integer
  // For values closer to ceiling, round up; for values closer to floor, round down
  if (fract > 0.5) {
    return floor + 1;
  }

  if (fract < -0.5) {
    return floor;
  }

  // For -0.5 < fract < 0.5, round to nearest
  if (fract < 0) {
    return fract < -0.25 ? floor : floor + 1;
  }

  return floor;
}