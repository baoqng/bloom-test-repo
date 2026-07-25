// bloom-deps:

export function roundQty(x: number): number {
  // Banker's rounding (round half to nearest even)
  // Math.round() in JavaScript uses "round half away from zero"
  // For banker's rounding, we need to implement it manually
  
  const floor = Math.floor(x);
  const ceil = Math.ceil(x);
  const remainder = x - floor;
  
  // If exactly halfway (0.5), round to nearest even
  if (Math.abs(remainder - 0.5) < Number.EPSILON) {
    // Round to the nearest even number
    return floor % 2 === 0 ? floor : ceil;
  }
  
  // Otherwise, use standard rounding
  return Math.round(x);
}