export function roundBankers(x: number): number {
  const floor = Math.floor(x);
  const ceil = Math.ceil(x);
  
  // If x is already an integer, return it
  if (floor === ceil) {
    return floor === 0 ? 0 : floor; // normalize -0 to +0
  }
  
  const fraction = x - floor;
  
  // If fraction is less than 0.5, round down
  if (fraction < 0.5) {
    const result = floor;
    return result === 0 ? 0 : result; // normalize -0 to +0
  }
  
  // If fraction is greater than 0.5, round up
  if (fraction > 0.5) {
    const result = ceil;
    return result === 0 ? 0 : result; // normalize -0 to +0
  }
  
  // Fraction is exactly 0.5, round to nearest even
  // floor is even, round down
  if (floor % 2 === 0) {
    const result = floor;
    return result === 0 ? 0 : result; // normalize -0 to +0
  }
  
  // floor is odd, round up to even
  const result = ceil;
  return result === 0 ? 0 : result; // normalize -0 to +0
}