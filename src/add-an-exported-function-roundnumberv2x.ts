// bloom-deps:

export function roundNumberV2(x: number): number {
  const floor = Math.floor(x);
  const frac = x - floor;
  
  if (frac < 0.5) {
    return floor;
  } else if (frac > 0.5) {
    return floor + 1;
  } else {
    // Exactly 0.5 - round to nearest even
    if (floor % 2 === 0) {
      return floor;
    } else {
      return floor + 1;
    }
  }
}