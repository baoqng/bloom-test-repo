// bloom-deps:

export function roundAllHalfEvenV19(xs: number[]): number[] {
  const result: number[] = [];

  for (const x of xs) {
    if (!Number.isFinite(x)) {
      throw new RangeError('all elements must be finite');
    }

    const floor = Math.floor(x);
    const fract = x - floor;

    let rounded: number;

    if (fract < 0.5) {
      rounded = floor;
    } else if (fract > 0.5) {
      rounded = floor + 1;
    } else {
      // Exact tie at 0.5: round to nearest even
      rounded = floor % 2 === 0 ? floor : floor + 1;
    }

    result.push(rounded);
  }

  return result;
}