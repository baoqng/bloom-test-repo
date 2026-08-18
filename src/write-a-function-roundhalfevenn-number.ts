// bloom-deps:

export function roundHalfEven(n: number): number {
  if (typeof n !== "number" || !isFinite(n)) {
    throw new TypeError(`Expected a finite number, got ${n}`);
  }

  const floor = Math.floor(n);
  const fract = n - floor;

  if (fract === 0.5) {
    // Banker's rounding: round to even
    return floor % 2 === 0 ? floor : floor + 1;
  }

  return Math.round(n);
}