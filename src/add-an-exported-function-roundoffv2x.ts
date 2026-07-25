// bloom-deps:

export function roundOffV2(x: number): number {
  const floor = Math.floor(x);
  const ceil = Math.ceil(x);
  const fraction = x - floor;

  // If exactly halfway (0.5)
  if (fraction === 0.5) {
    // Round to nearest even integer (banker's rounding)
    return floor % 2 === 0 ? floor : ceil;
  }

  // If exactly halfway for negative numbers
  if (fraction === -0.5 || (x < 0 && x - ceil === 0.5)) {
    // For negative numbers, ceil is the "lower" absolute value
    return ceil % 2 === 0 ? ceil : floor;
  }

  // Standard rounding for non-halfway cases
  return Math.round(x);
}