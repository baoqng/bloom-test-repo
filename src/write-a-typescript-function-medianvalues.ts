// bloom-deps:

function median(values: unknown): number {
  if (!Array.isArray(values) || values.length === 0) {
    throw new TypeError('Expected non-empty array');
  }

  for (let i = 0; i < values.length; i++) {
    const el = values[i];
    if (typeof el !== 'number' || !Number.isFinite(el)) {
      throw new TypeError(`Expected finite number at index ${i}`);
    }
  }

  const sorted = [...values].sort((a, b) => (a as number) - (b as number));
  const mid = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return ((sorted[mid - 1] as number) + (sorted[mid] as number)) / 2;
  }

  return sorted[mid] as number;
}

export { median };