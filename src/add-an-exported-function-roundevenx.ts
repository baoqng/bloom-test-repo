export function roundEven(x: number): number {
  // Handle special cases
  if (Object.is(x, -0)) return 0;
  if (!isFinite(x) || isNaN(x)) return x;

  const floor = Math.floor(x);
  const ceil = Math.ceil(x);
  
  // If x is already an integer, return it
  if (floor === ceil) {
    return floor;
  }
  
  const fraction = x - floor;
  
  // If fraction is exactly 0.5, round to the nearest even integer
  if (Math.abs(fraction - 0.5) < 1e-10) {
    // floor is even, round down
    if (floor % 2 === 0) {
      return floor === 0 ? 0 : floor;
    }
    // floor is odd, round up to ceil (which will be even)
    return ceil === 0 ? 0 : ceil;
  }
  
  // If fraction < 0.5, round down
  if (fraction < 0.5) {
    return floor === 0 ? 0 : floor;
  }
  
  // If fraction > 0.5, round up
  return ceil === 0 ? 0 : ceil;
}