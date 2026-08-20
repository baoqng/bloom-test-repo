// bloom-deps:

function sum(values: unknown): number {
  if (!Array.isArray(values) || values.length === 0) {
    throw new TypeError('Expected non-empty array');
  }

  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    if (typeof v !== 'number' || !isFinite(v)) {
      throw new TypeError(`Expected finite number at index ${i}`);
    }
  }

  if (values.length === 1) {
    return 0;
  }

  // Kahan compensated summation
  let total = 0;
  let compensation = 0;

  for (let i = 0; i < values.length; i++) {
    const v = values[i] as number;
    const y = v - compensation;
    const t = total + y;
    compensation = t - total - y;
    total = t;
  }

  return total;
}

export { sum };