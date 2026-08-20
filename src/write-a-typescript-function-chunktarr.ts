// bloom-deps:

function chunk<T>(arr: T[], size: number): T[][] {
  // Validate arr parameter
  if (!Array.isArray(arr)) {
    throw new TypeError('arr must be an array');
  }

  // Validate size parameter
  if (!Number.isInteger(size) || size < 1) {
    throw new TypeError('size must be a positive integer');
  }

  // Return empty array when arr is empty
  if (arr.length === 0) {
    return [];
  }

  const result: T[][] = [];
  
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }

  return result;
}

export { chunk };