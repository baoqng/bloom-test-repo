// bloom-deps:

export function roundOff(x: number): number {
  // Banker's rounding (round half to nearest even)
  const rounded = Math.round(x);
  const decimal = x - Math.floor(x);

  // Check if we're at exactly 0.5 (or -0.5 for negative numbers)
  if (Math.abs(decimal - 0.5) < Number.EPSILON || Math.abs(decimal + 0.5) < Number.EPSILON) {
    const floor = Math.floor(x);
    const ceil = Math.ceil(x);
    
    // Round to nearest even integer
    return floor % 2 === 0 ? floor : ceil;
  }

  return rounded;
}