// bloom-deps:

export function computePercentile(sortedValues: unknown, percentile: unknown): number {
  if (!Array.isArray(sortedValues) || sortedValues.length === 0) {
    throw new TypeError('sortedValues must be a non-empty array');
  }

  for (const val of sortedValues) {
    if (typeof val !== 'number' || !Number.isFinite(val)) {
      throw new TypeError('each value must be a finite number');
    }
  }

  if (typeof percentile !== 'number' || Number.isNaN(percentile)) {
    throw new TypeError('percentile must be a number');
  }

  if (!Number.isFinite(percentile) || percentile < 0 || percentile > 100) {
    throw new RangeError('percentile must be between 0 and 100 inclusive');
  }

  const values = sortedValues as number[];
  const n = values.length;

  const index = (percentile / 100) * (n - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);

  return values[lower] + (index - lower) * (values[upper] - values[lower]);
}