// bloom-deps:

export function roundAllHalfEvenV14(xs: number[]): number[] {
  const result: number[] = [];

  for (const x of xs) {
    if (!Number.isFinite(x)) {
      throw new RangeError("all elements must be finite");
    }

    const floor = Math.floor(x);
    const fract = x - floor;

    let rounded: number;

    if (fract === 0.5) {
      // Exact tie: round to nearest even integer
      rounded = floor % 2 === 0 ? floor : floor + 1;
    } else if (fract > 0.5) {
      // Closer to ceiling
      rounded = floor + 1;
    } else {
      // Closer to floor (includes fract < 0.5 and fract === 0)
      rounded = floor;
    }

    result.push(rounded);
  }

  return result;
}