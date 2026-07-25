// bloom-deps:

export function roundAllHalfEvenV25(xs: number[]): number[] {
  const result: number[] = [];
  
  for (const x of xs) {
    if (!Number.isFinite(x)) {
      throw new RangeError('all elements must be finite');
    }
    
    const rounded = roundHalfEven(x);
    result.push(rounded);
  }
  
  return result;
}

function roundHalfEven(x: number): number {
  const floor = Math.floor(x);
  const fract = x - floor;
  
  if (fract < 0.5) {
    return floor;
  }
  
  if (fract > 0.5) {
    return floor + 1;
  }
  
  // fract === 0.5 exactly (banker's rounding / round-half-to-even)
  // Round to the nearest even integer
  if (floor % 2 === 0) {
    return floor;
  } else {
    return floor + 1;
  }
}