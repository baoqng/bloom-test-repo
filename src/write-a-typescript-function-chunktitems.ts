// bloom-deps:

function chunk<T>(items: T[], size: number): T[][] {
  if (!Array.isArray(items)) {
    throw new TypeError('items must be an array');
  }

  if (!Number.isInteger(size) || size < 1) {
    throw new RangeError('size must be a positive integer');
  }

  if (items.length === 0) {
    return [];
  }

  const result: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    result.push(items.slice(i, i + size));
  }
  return result;
}

export { chunk };