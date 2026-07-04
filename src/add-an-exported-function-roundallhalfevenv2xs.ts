// bloom-deps:

export function roundHalfEven(x: number): number {
  const floor = Math.floor(x);
  const diff = x - floor;

  if (diff < 0.5) return floor;
  if (diff > 0.5) return floor + 1;

  // Exactly 0.5 — round to nearest even
  if (floor % 2 === 0) return floor;
  return floor + 1;
}

export function roundAllHalfEvenV2(xs: number[]): number[] {
  for (const x of xs) {
    if (!Number.isFinite(x)) {
      throw new RangeError('all elements must be finite');
    }
  }
  return xs.map(x => {
    const result = roundHalfEven(x);
    // Convert -0 to +0
    return Object.is(result, -0) ? 0 : result;
  });
}