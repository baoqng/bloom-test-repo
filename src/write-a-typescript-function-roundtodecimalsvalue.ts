// bloom-deps:

export function roundToDecimals(value: number, decimals: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new TypeError('value must be a finite number');
  }
  if (!Number.isInteger(decimals) || decimals < 0) {
    throw new RangeError('decimals must be a non-negative integer');
  }

  const factor = Math.pow(10, decimals);
  const shifted = value * factor;
  const floor = Math.floor(shifted);
  const fract = shifted - floor;

  let rounded: number;
  if (Math.abs(fract - 0.5) < 1e-10) {
    // Half-to-even (banker's rounding)
    if (floor % 2 === 0) {
      rounded = floor;
    } else {
      rounded = floor + 1;
    }
  } else {
    rounded = Math.round(shifted);
  }

  return rounded / factor;
}