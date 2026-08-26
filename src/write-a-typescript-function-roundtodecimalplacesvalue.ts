// bloom-deps:

export function roundToDecimalPlaces(value: unknown, places: unknown): number {
  if (typeof value !== 'number' || !isFinite(value) || isNaN(value)) {
    throw new TypeError('value must be a finite number');
  }

  if (typeof places !== 'number') {
    throw new TypeError('places must be a number');
  }

  if (isNaN(places) || !isFinite(places)) {
    throw new TypeError('places must be finite');
  }

  if (!Number.isInteger(places) || places < 0 || places > 15) {
    throw new RangeError('places must be an integer between 0 and 15');
  }

  const factor = Math.pow(10, places);
  return Math.round(value * factor) / factor;
}