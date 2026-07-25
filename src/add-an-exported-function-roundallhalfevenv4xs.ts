// bloom-deps:

export function roundAllHalfEvenV4(xs: number[]): number[] {
  // Type guard: validate all elements are finite numbers
  for (let i = 0; i < xs.length; i++) {
    const element = xs[i];
    if (typeof element !== 'number' || !Number.isFinite(element)) {
      throw new RangeError('all elements must be finite');
    }
  }

  // Map each element to its round-half-to-even value
  return xs.map((x) => {
    const floor = Math.floor(x);
    const fract = x - floor;

    // Not a tie: round to nearest
    if (fract !== 0.5 && fract !== -0.5) {
      return Math.round(x);
    }

    // Tie detected: round to nearest even integer
    // For positive x.5: if floor is even, return floor; else return floor + 1
    // For negative x.5: if floor is even, return floor; else return floor - 1
    if (fract === 0.5) {
      return floor % 2 === 0 ? floor : floor + 1;
    } else {
      // fract === -0.5
      return floor % 2 === 0 ? floor : floor - 1;
    }
  });
}