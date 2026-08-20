// bloom-deps:

export function splitAt<T>(items: T[], index: number): [T[], T[]] {
  if (!Array.isArray(items)) {
    throw new TypeError('items must be an array');
  }

  if (!Number.isInteger(index)) {
    throw new TypeError('index must be an integer');
  }

  let clampedIndex = index;
  if (clampedIndex < 0) {
    clampedIndex = 0;
  } else if (clampedIndex > items.length) {
    clampedIndex = items.length;
  }

  const before = items.slice(0, clampedIndex);
  const after = items.slice(clampedIndex);

  return [before, after];
}