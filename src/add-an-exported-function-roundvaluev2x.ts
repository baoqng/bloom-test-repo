// bloom-deps:

export function roundValueV2(x: number): number {
  // Banker's rounding (round half to nearest even)
  // Math.round() in JavaScript uses "round half away from zero"
  // We need to implement banker's rounding (round half to nearest even)
  
  const floor = Math.floor(x);
  const ceil = Math.ceil(x);
  const remainder = x - floor;
  
  // If not exactly at .5, use normal rounding
  if (Math.abs(remainder - 0.5) > 1e-10) {
    return Math.round(x);
  }
  
  // At exactly .5, round to nearest even
  // If floor is even, round down; if floor is odd, round up
  return floor % 2 === 0 ? floor : ceil;
}