// bloom-deps:

export function flatMap<T, U>(arr: T[], fn: (item: T, index: number) => U[]): U[] {
  if (!Array.isArray(arr)) {
    throw new TypeError(`Expected arr to be an Array, but received ${typeof arr}`);
  }

  if (typeof fn !== 'function') {
    throw new TypeError(`Expected fn to be a function, but received ${typeof fn}`);
  }

  const result: U[] = [];

  for (let i = 0; i < arr.length; i++) {
    const mapped = fn(arr[i], i);

    if (!Array.isArray(mapped)) {
      throw new TypeError(`Expected fn to return an Array, but received ${typeof mapped} at index ${i}`);
    }

    for (let j = 0; j < mapped.length; j++) {
      result.push(mapped[j]);
    }
  }

  return result;
}