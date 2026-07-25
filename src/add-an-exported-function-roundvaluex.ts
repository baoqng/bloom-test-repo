// bloom-deps:

export function roundValue(x: number): number {
  // Banker's rounding (round half to nearest even)
  // Math.round() in JavaScript uses "round half away from zero"
  // We need to implement banker's rounding instead
  
  const floor = Math.floor(x);
  const ceil = Math.ceil(x);
  const remainder = x - floor;
  
  // If remainder is exactly 0.5, round to nearest even
  if (Math.abs(remainder - 0.5) < 1e-10) {
    return floor % 2 === 0 ? floor : ceil;
  }
  
  // Otherwise use standard rounding
  return remainder < 0.5 ? floor : ceil;
}