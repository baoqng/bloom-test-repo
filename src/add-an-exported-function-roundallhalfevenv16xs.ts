// bloom-deps:

export function roundAllHalfEvenV16(xs: number[]): number[] {
  // Validate all elements are finite
  for (const x of xs) {
    if (!Number.isFinite(x)) {
      throw new RangeError('all elements must be finite');
    }
  }

  // Create new array with rounded values
  const result: number[] = [];
  
  for (const x of xs) {
    const floor = Math.floor(x);
    const fract = x - floor;
    
    // Not a tie: use standard rounding
    if (fract !== 0.5 && fract !== -0.5) {
      result.push(Math.round(x));
      continue;
    }
    
    // Tie case: round to nearest even
    const rounded = fract === 0.5 
      ? (floor % 2 === 0 ? floor : floor + 1)
      : (floor % 2 === 0 ? floor : floor - 1);
    
    result.push(rounded);
  }
  
  return result;
}