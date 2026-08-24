// bloom-deps:

function roundHalf(n: number): number {
  if (!isFinite(n)) {
    return n;
  }

  const floor = Math.floor(n);
  const fract = n - floor;

  if (fract === 0.5) {
    // Banker's rounding: round to nearest even integer
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