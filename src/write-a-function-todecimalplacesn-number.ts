// bloom-deps:

export function toDecimalPlaces(n: number, places: number): number {
  if (typeof n !== 'number' || !isFinite(n)) {
    throw new TypeError('n must be a finite number');
  }
  if (!Number.isInteger(places) || places < 0) {
    throw new RangeError('places must be a non-negative integer');
  }

  return toDecimalPlacesImpl(n, places);
}

function toDecimalPlacesImpl(n: number, places: number): number {
  const factor = Math.pow(10, places);
  const shifted = n * factor;
  const floor = Math.floor(shifted);
  const fract = shifted - floor;

  let rounded: number;
  if (Math.abs(fract - 0.5) < 1e-10) {
    if (n >= 0) {
      // positive: round up (away from zero = towards +Infinity)
      rounded = (floor + 1) / factor;
    } else {
      // negative: round down (away from zero = towards -Infinity)
      // e.g. n=-2.5, factor=1, shifted=-2.5, floor=-3, fract=0.5
      // away from zero means -3
      rounded = floor / factor;
    }
  } else {
    rounded = Math.round(shifted) / factor;
  }

  return rounded;
}