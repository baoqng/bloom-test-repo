// bloom-deps:

function splitAt<T>(items: T[], index: number): [T[], T[]] {
  if (!Array.isArray(items)) {
    throw new TypeError('items must be an array');
  }

  if (!Number.isInteger(index)) {
    throw new TypeError('index must be an integer');
  }

  const clampedIndex = Math.max(0, Math.min(index, items.length));

  const before = items.slice(0, clampedIndex);
  const from = items.slice(clampedIndex);

  return [before, from];
}

export { splitAt };