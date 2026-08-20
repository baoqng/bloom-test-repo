// bloom-deps:

function median(values: unknown): number {
  if (!Array.isArray(values) || values.length === 0) {
    throw new TypeError('Expected non-empty array');
  }

  for (let i = 0; i < values.length; i++) {
    const element = values[i];
    if (typeof element !== 'number' || !Number.isFinite(element)) {
      throw new TypeError(`Expected finite number at index ${i}`);
    }
  }

  const sorted = [...values].sort((a, b) => (a as number) - (b as number));
  const len = sorted.length;
  const mid = Math.floor(len / 2);

  if (len % 2 === 1) {
    return sorted[mid] as number;
  } else {
    return ((sorted[mid - 1] as number) + (sorted[mid] as number)) / 2;
  }
}

export { median };