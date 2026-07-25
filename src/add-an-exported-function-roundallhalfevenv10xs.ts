// bloom-deps:

export function roundAllHalfEvenV10(xs: number[]): number[] {
  const result: number[] = [];

  for (const x of xs) {
    if (!Number.isFinite(x)) {
      throw new RangeError('all elements must be finite');
    }

    const floor = Math.floor(x);
    const fract = x - floor;

    let rounded: number;

    if (fract === 0.5) {
      // Tie: round to nearest even
      if (floor % 2 === 0) {
        rounded = floor;
      } else {
        rounded = floor + 1;
      }
    } else if (fract > 0.5) {
      rounded = floor + 1;
    } else {
      rounded = floor;
    }

    result.push(rounded);
  }

  return result;
}