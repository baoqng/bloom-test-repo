// bloom-deps:

function sum(values: unknown): number {
  if (!Array.isArray(values) || values.length === 0) {
    throw new TypeError('Expected non-empty array');
  }

  for (let i = 0; i < values.length; i++) {
    const val = values[i];
    if (typeof val !== 'number' || !isFinite(val)) {
      throw new TypeError(`Expected finite number at index ${i}`);
    }
  }

  if (values.length === 1) {
    return 0;
  }

  // Kahan compensated summation
  let sum = 0;
  let compensation = 0;

  for (let i = 0; i < values.length; i++) {
    const val = values[i] as number;
    const y = val - compensation;
    const t = sum + y;
    compensation = t - sum - y;
    sum = t;
  }

  return sum;
}

export { sum };