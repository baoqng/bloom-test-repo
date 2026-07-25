// bloom-deps:

export function roundHalfEvenV7(x: number): number {
  // Validate input: must be a finite number
  if (typeof x !== 'number' || !Number.isFinite(x)) {
    throw new RangeError('x must be finite');
  }

  // Get the integer part and fractional part
  const floor = Math.floor(x);
  const fract = x - floor;

  // If fractional part is exactly 0.5, apply banker's rounding (round to even)
  if (fract === 0.5) {
    // Round to the nearest even integer
    // If floor is even, round down to floor
    // If floor is odd, round up to floor + 1
    return floor % 2 === 0 ? floor : floor + 1;
  }

  // For negative numbers with exact 0.5 fractional part
  if (fract === -0.5) {
    // For negative x, Math.floor rounds down (more negative)
    // We need to check if floor is even or odd and apply banker's rounding
    return floor % 2 === 0 ? floor : floor - 1;
  }

  // For all other cases, round to nearest integer using standard rounding
  return Math.round(x);
}