// bloom-deps:

export function roundQty(x: number): number {
  const floor = Math.floor(x);
  const frac = x - floor;
  
  // For positive numbers
  if (frac < 0.5) {
    return floor;
  }
  if (frac > 0.5) {
    return floor + 1;
  }
  
  // Exact half: round to nearest even
  if (frac === 0.5) {
    return floor % 2 === 0 ? floor : floor + 1;
  }
  
  // For negative numbers, handle similarly
  if (x < 0) {
    const ceil = Math.ceil(x);
    const negFrac = x - ceil;
    
    if (negFrac > -0.5) {
      return ceil;
    }
    if (negFrac < -0.5) {
      return ceil - 1;
    }
    
    // Exact half for negative: round to nearest even
    if (negFrac === -0.5) {
      return ceil % 2 === 0 ? ceil : ceil - 1;
    }
  }
  
  return Math.round(x);
}