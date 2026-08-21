// bloom-deps:

function roundToDecimals(value: number, decimals: number): number {
  if (!Number.isFinite(value)) {
    throw new TypeError('value must be a finite number');
  }

  if (!Number.isInteger(decimals) || decimals < 0) {
    throw new RangeError('decimals must be a non-negative integer');
  }

  const factor = Math.pow(10, decimals);
  const shifted = value * factor;
  const rounded = Math.round(shifted);

  return rounded / factor;
}

export { roundToDecimals };