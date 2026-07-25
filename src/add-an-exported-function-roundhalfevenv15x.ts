// bloom-deps:

export function roundHalfEvenV15(x: number): number {
  // Type validation guard - must fire BEFORE any arithmetic
  if (typeof x !== 'number' || !Number.isFinite(x)) {
    throw new RangeError('x must be finite');
  }

  // For non-tie cases, use standard rounding
  const floor = Math.floor(x);
  const fract = x - floor;

  // Exact tie detection (banker's rounding)
  if (fract === 0.5) {
    // Round to the nearest even integer
    return floor % 2 === 0 ? floor : floor + 1;
  }

  // For negative numbers with exact tie
  if (fract === -0.5) {
    // Round to the nearest even integer
    return floor % 2 === 0 ? floor : floor - 1;
  }

  // Standard rounding for non-tie cases
  return Math.round(x);
}