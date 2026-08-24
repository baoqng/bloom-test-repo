// bloom-deps:

function roundHalf(n: number): number {
  if (!Number.isFinite(n)) {
    throw new TypeError(`roundHalf requires a finite number, got: ${n}`);
  }

  const floor = Math.floor(n);
  const fract = n - floor;

  if (fract === 0.5) {
    // Banker's rounding: round to nearest even
    if (floor % 2 === 0) {
      return floor;
    } else {
      return floor + 1;
    }
  } else {
    return Math.round(n);
  }
}

export { roundHalf };