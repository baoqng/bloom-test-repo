export function wIdentityR8(x: number): number {
  const floor = Math.floor(x);
  const frac = x - floor;
  
  if (Math.abs(frac - 0.5) < 1e-10) {
    // Tie case: round to even
    return floor % 2 === 0 ? floor : floor + 1;
  } else if (frac < 0.5) {
    return floor;
  } else {
    return floor + 1;
  }
}