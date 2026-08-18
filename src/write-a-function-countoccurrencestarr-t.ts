// bloom-deps:

function countOccurrences<T>(arr: T[], value: T): number {
  if (!Array.isArray(arr)) {
    throw new TypeError('arr must be an array');
  }
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === value) {
      count++;
    }
  }
  return count;
}

export { countOccurrences };