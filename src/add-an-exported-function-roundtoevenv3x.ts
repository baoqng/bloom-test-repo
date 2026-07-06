export function roundToEvenV3(x: number): number {
  const floor = Math.floor(x);
  const frac = x - floor;

  // Not halfway: use standard rounding
  if (Math.abs(frac - 0.5) > 1e-10) {
    const result = Math.round(x);
    // Convert -0 to +0
    return result === 0 ? 0 : result;
  }

  // Exactly halfway: round to even
  if (frac > 0) {
    // x is positive and exactly .5
    // floor is the lower integer, floor + 1 is the upper integer
    const result = floor % 2 === 0 ? floor : floor + 1;
    return result === 0 ? 0 : result;
  } else if (frac < 0) {
    // x is negative and exactly .5
    // floor is the lower integer (more negative), floor + 1 is the upper integer (less negative)
    const result = (floor + 1) % 2 === 0 ? floor + 1 : floor;
    return result === 0 ? 0 : result;
  } else {
    // frac === 0, x is already an integer
    return floor === 0 ? 0 : floor;
  }
}