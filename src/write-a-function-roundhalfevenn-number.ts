// bloom-deps:

function roundHalfEven(n: number): number {
  if (typeof n !== 'number' || !isFinite(n)) {
    throw new TypeError('n must be a finite number');
  }

  const floor = Math.floor(n);
  const fract = n - floor;

  if (fract === 0.5) {
    // Banker's rounding: round to even
    if (floor % 2 === 0) {
      return floor;
    } else {
      return floor + 1;
    }
  } else {
    return Math.round(n);
  }
}

export { roundHalfEven };