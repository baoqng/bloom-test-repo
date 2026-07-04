// bloom-deps:

export function roundValueV2(x: number): number {
  const floor = Math.floor(x);
  const fraction = x - floor;
  
  // Handle exact halves using banker's rounding (round to nearest even)
  if (fraction === 0.5) {
    return floor % 2 === 0 ? floor : floor + 1;
  }
  
  // Handle negative exact halves
  if (fraction === -0.5 || (x < 0 && x - Math.ceil(x) === -0.5)) {
    const ceil = Math.ceil(x);
    return ceil % 2 === 0 ? ceil : ceil - 1;
  }
  
  // Standard rounding for non-half cases
  const result = Math.round(x);
  
  // Ensure positive zero is returned instead of negative zero
  return result === 0 ? 0 : result;
}