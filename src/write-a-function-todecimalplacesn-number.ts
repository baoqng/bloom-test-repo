// bloom-deps:

function toDecimalPlaces(n: number, places: number): number {
  if (typeof n !== 'number' || !isFinite(n)) {
    throw new TypeError('n must be a finite number');
  }
  if (!Number.isInteger(places) || places < 0) {
    throw new RangeError('places must be a non-negative integer');
  }

  const factor = Math.pow(10, places);
  const sign = n < 0 ? -1 : 1;
  const abs = Math.abs(n);
  const shifted = abs * factor;
  const floor = Math.floor(shifted);
  const fract = shifted - floor;

  let rounded: number;
  if (Math.abs(fract - 0.5) < 1e-10) {
    rounded = (floor + 1) / factor;
  } else {
    rounded = Math.round(shifted) / factor;
  }

  return sign * rounded;
}

export { toDecimalPlaces };