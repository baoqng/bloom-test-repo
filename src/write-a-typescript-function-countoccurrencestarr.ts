// bloom-deps:

function countOccurrences<T>(arr: T[], value: T): number {
  if (!Array.isArray(arr)) {
    throw new TypeError('arr must be an Array');
  }

  let count = 0;

  for (let i = 0; i < arr.length; i++) {
    const element = arr[i];

    if (
      typeof value === 'number' &&
      Number.isNaN(value) &&
      typeof element === 'number' &&
      Number.isNaN(element as unknown as number)
    ) {
      count++;
    } else if (element === value) {
      count++;
    }
  }

  return count;
}

export { countOccurrences };