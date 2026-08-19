// bloom-deps:

function flattenOne<T>(arr: (T | T[])[]): T[] {
  // Validate arr is an Array
  if (!Array.isArray(arr)) {
    throw new TypeError('arr must be an Array');
  }

  const result: T[] = [];

  for (const element of arr) {
    if (Array.isArray(element)) {
      // Flatten one level - add all elements from the nested array
      result.push(...element);
    } else {
      // Non-array elements are included as-is
      result.push(element);
    }
  }

  return result;
}

export { flattenOne };