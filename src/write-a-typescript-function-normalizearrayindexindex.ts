// bloom-deps:

export function normalizeArrayIndex(index: unknown, length: unknown): number {
  if (typeof index !== 'number') {
    throw new TypeError('index must be a number');
  }
  if (typeof length !== 'number') {
    throw new TypeError('length must be a number');
  }
  if (!isFinite(index) || isNaN(index)) {
    throw new TypeError('index must be finite');
  }
  if (!isFinite(length) || isNaN(length)) {
    throw new TypeError('length must be finite');
  }
  if (!Number.isInteger(index)) {
    throw new RangeError('index must be an integer');
  }
  if (!Number.isInteger(length) || length < 0) {
    throw new RangeError('length must be a non-negative integer');
  }

  let resolved = index < 0 ? index + length : index;

  if (resolved < 0 || resolved >= length) {
    throw new RangeError('Index out of bounds');
  }

  return resolved;
}