// bloom-deps:

export function roundAllHalfEvenV20(xs: number[]): number[] {
  const result: number[] = [];

  for (const x of xs) {
    if (!Number.isFinite(x)) {
      throw new RangeError('all elements must be finite');
    }

    const floor = Math.floor(x);
    const fract = x - floor;

    let rounded: number;

    if (fract === 0.5) {
      if (floor % 2 === 0) {
        rounded = floor;
      } else {
        rounded = floor + 1;
      }
    } else if (fract === -0.5) {
      if (floor % 2 === 0) {
        rounded = floor;
      } else {
        rounded = floor - 1;
      }
    } else {
      rounded = Math.round(x);
    }

    result.push(rounded);
  }

  return result;
}