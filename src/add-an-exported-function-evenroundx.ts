export function evenRound(x: number): number {
  const floor = Math.floor(x);
  const ceil = Math.ceil(x);
  const remainder = x - floor;

  // If x is an integer, return it as-is
  if (remainder === 0) {
    return floor;
  }

  // If exactly halfway between two integers (remainder === 0.5)
  if (remainder === 0.5) {
    // Round to the even integer
    const result = floor % 2 === 0 ? floor : ceil;
    // Avoid returning -0; normalize to +0
    return result === 0 ? 0 : result;
  }

  // If remainder < 0.5, round down; otherwise round up
  return remainder < 0.5 ? floor : ceil;
}