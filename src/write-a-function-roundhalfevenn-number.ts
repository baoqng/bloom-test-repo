// bloom-deps:

export function roundHalfEven(n: number): number {
  if (typeof n !== "number" || !isFinite(n)) {
    throw new TypeError(`Expected a finite number, got ${n}`);
  }

  const floor = Math.floor(n);
  const fract = n - floor;

  if (fract === 0.5) {
    // Round to even
    if (floor % 2 === 0) {
      return floor;
    } else {
      return floor + 1;
    }
  } else {
    return Math.round(n);
  }
}