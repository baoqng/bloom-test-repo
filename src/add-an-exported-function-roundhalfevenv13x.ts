// bloom-deps:

export function roundHalfEvenV13(x: number): number {
  // Type validation guard - must fire BEFORE any arithmetic
  if (typeof x !== 'number' || !Number.isFinite(x)) {
    throw new RangeError('x must be finite');
  }

  // For integers, return as-is
  if (Number.isInteger(x)) {
    return x;
  }

  // Get the floor and ceiling
  const floor = Math.floor(x);
  const ceil = floor + 1;
  
  // Calculate the fractional part
  const fract = x - floor;
  
  // Use strict equality (no epsilon tolerance) per contract
  if (fract === 0.5) {
    // Tie case: round to even
    // If floor is even, round down; if floor is odd, round up
    return floor % 2 === 0 ? floor : ceil;
  }
  
  // Not a tie: round to nearest
  return fract < 0.5 ? floor : ceil;
}