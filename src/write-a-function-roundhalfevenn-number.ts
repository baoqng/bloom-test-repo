// bloom-deps:

function roundHalfEven(n: number): number {
  // Type validation guard - must fire BEFORE any arithmetic
  if (typeof n !== 'number' || !isFinite(n)) {
    throw new TypeError('n must be a finite number');
  }

  // Get the integer and fractional parts
  const floor = Math.floor(n);
  const fract = n - floor;

  // If fractional part is exactly 0.5 (tie), apply banker's rounding
  if (fract === 0.5) {
    // Round to the nearest even integer
    return floor % 2 === 0 ? floor : floor + 1;
  }

  // If fractional part is exactly -0.5 (tie for negative numbers)
  if (fract === -0.5) {
    // For negative numbers, floor is already one less than the integer
    // We need to round to the nearest even integer
    const ceil = floor + 1;
    return ceil % 2 === 0 ? ceil : floor;
  }

  // For all other cases, use standard rounding (nearest integer)
  return Math.round(n);
}

export { roundHalfEven };