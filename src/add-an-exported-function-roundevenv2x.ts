export function roundEvenV2(x: number): number {
  const floor = Math.floor(x);
  const ceil = Math.ceil(x);
  const frac = x - floor;

  // If x is an integer
  if (frac === 0) {
    return x === 0 ? 0 : floor;
  }

  // If x is exactly halfway between two integers
  if (frac === 0.5) {
    // Round to the even integer
    const result = floor % 2 === 0 ? floor : ceil;
    return result === 0 ? 0 : result;
  }

  // If x is exactly halfway between two integers (negative case)
  if (frac === -0.5) {
    // Round to the even integer
    const result = ceil % 2 === 0 ? ceil : floor;
    return result === 0 ? 0 : result;
  }

  // For all other cases, round to nearest integer
  const result = Math.round(x);
  return result === 0 ? 0 : result;
}