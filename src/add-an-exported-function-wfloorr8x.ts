export function wFloorR8(x: number): number {
  const rounded = Math.round(x);
  const diff = x - rounded;
  // If x is not a half-way case, Math.round works (but Math.round rounds .5 up, so we need to handle it)
  // Check if x is exactly halfway between two integers
  const fraction = x - Math.floor(x);
  if (fraction === 0.5) {
    // Banker's rounding: round to even
    const floor = Math.floor(x);
    const ceil = Math.ceil(x);
    if (floor % 2 === 0) {
      return floor;
    } else {
      return ceil;
    }
  } else if (fraction === 0 ) {
    return x;
  } else {
    // Standard rounding
    return Math.round(x);
  }
}