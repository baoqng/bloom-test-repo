// bloom-deps:

function toDecimalPlaces(n: number, places: number): number {
  if (typeof n !== 'number') {
    throw new TypeError('n must be a number');
  }
  if (!Number.isFinite(n)) {
    throw new TypeError('n must be a finite number');
  }
  if (typeof places !== 'number' || !Number.isInteger(places) || places < 0) {
    throw new RangeError('places must be a non-negative integer');
  }

  const factor = Math.pow(10, places);
  const shifted = n * factor;
  const floor = Math.floor(shifted);
  const fract = shifted - floor;

  let rounded: number;
  if (fract === 0.5) {
    // half-away-from-zero: round up for positive, down for negative
    if (n >= 0) {
      rounded = (floor + 1) / factor;
    } else {
      rounded = floor / factor;
    }
  } else {
    rounded = Math.round(shifted) / factor;
  }

  return rounded;
}

export { toDecimalPlaces };