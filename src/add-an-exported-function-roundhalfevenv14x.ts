// bloom-deps:

export function roundHalfEvenV14(x: number): number {
  // Type guard: reject non-finite numbers
  if (typeof x !== 'number' || !Number.isFinite(x)) {
    throw new RangeError('x must be finite');
  }

  // If already an integer, return as-is
  if (Number.isInteger(x)) {
    return x;
  }

  // Get the integer part and fractional part
  const intPart = Math.trunc(x);
  const fracPart = x - intPart;

  // Check if exactly halfway (0.5 or -0.5)
  if (fracPart === 0.5) {
    // Positive halfway: round to nearest even
    // intPart is the lower integer, intPart + 1 is the upper
    // Choose the even one
    return intPart % 2 === 0 ? intPart : intPart + 1;
  } else if (fracPart === -0.5) {
    // Negative halfway: round to nearest even
    // intPart is the upper integer (more negative), intPart - 1 is the lower
    // We want the even one
    return intPart % 2 === 0 ? intPart : intPart - 1;
  }

  // Not a tie: round to nearest integer using standard rounding
  return Math.round(x);
}