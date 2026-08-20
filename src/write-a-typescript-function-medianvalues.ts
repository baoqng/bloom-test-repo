// bloom-deps:

function median(values: unknown): number {
  // Validate that values is an array
  if (!Array.isArray(values)) {
    throw new TypeError('Expected non-empty array');
  }

  // Validate that array is non-empty
  if (values.length === 0) {
    throw new TypeError('Expected non-empty array');
  }

  // Validate each element is a finite number
  for (let i = 0; i < values.length; i++) {
    const element = values[i];
    if (typeof element !== 'number' || !Number.isFinite(element)) {
      throw new TypeError(`Expected finite number at index ${i}`);
    }
  }

  // Create a sorted copy without mutating the input array
  const sorted = [...values].sort((a, b) => a - b);

  const length = sorted.length;
  const middleIndex = Math.floor(length / 2);

  // For odd-length arrays, return the middle element
  if (length % 2 === 1) {
    return sorted[middleIndex];
  }

  // For even-length arrays, return the average of the two middle values
  return (sorted[middleIndex - 1] + sorted[middleIndex]) / 2;
}

export { median };