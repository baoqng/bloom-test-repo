// bloom-deps:

function countOccurrences<T>(arr: T[], value: T): number {
  if (!Array.isArray(arr)) {
    throw new TypeError('arr must be an Array');
  }

  let count = 0;

  for (let i = 0; i < arr.length; i++) {
    const element = arr[i];
    if (element === value) {
      count++;
    } else if (
      typeof value === 'number' &&
      typeof element === 'number' &&
      Number.isNaN(value) &&
      Number.isNaN(element)
    ) {
      count++;
    }
  }

  return count;
}

export { countOccurrences };