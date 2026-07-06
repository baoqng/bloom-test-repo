export function roundHalfEvenV2(x: number): number {
  const floor = Math.floor(x);
  const ceil = Math.ceil(x);
  const frac = x - floor;

  // Not halfway between two integers
  if (Math.abs(frac - 0.5) > 1e-10) {
    const result = Math.round(x);
    // Avoid returning -0
    return result === 0 ? 0 : result;
  }

  // Exactly halfway: round to even
  if (floor % 2 === 0) {
    return floor === 0 ? 0 : floor;
  } else {
    return ceil === 0 ? 0 : ceil;
  }
}