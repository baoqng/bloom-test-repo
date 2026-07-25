// bloom-deps:

export function roundNumber(x: number): number {
  // Banker's rounding (round half to nearest even)
  // Math.round() in JavaScript uses "round half away from zero"
  // We need to implement banker's rounding manually
  
  const floor = Math.floor(x);
  const ceil = Math.ceil(x);
  const fraction = x - floor;
  
  // If fraction is exactly 0.5, round to nearest even
  if (fraction === 0.5) {
    // floor is even, round down
    if (floor % 2 === 0) {
      return floor;
    }
    // floor is odd, round up
    return ceil;
  }
  
  // If fraction is exactly -0.5 (for negative numbers)
  if (fraction === -0.5) {
    // ceil is even, round up
    if (ceil % 2 === 0) {
      return ceil;
    }
    // ceil is odd, round down
    return floor;
  }
  
  // For all other cases, use standard rounding
  return Math.round(x);
}