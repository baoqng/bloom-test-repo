// bloom-deps:

export function flatMap<T, U>(arr: T[], fn: (item: T, index: number) => U[]): U[] {
  if (!Array.isArray(arr)) {
    throw new TypeError(`Expected first argument to be an Array, but received ${arr === null ? 'null' : typeof arr}`);
  }

  if (typeof fn !== 'function') {
    throw new TypeError(`Expected second argument to be a function, but received ${fn === null ? 'null' : typeof fn}`);
  }

  const result: U[] = [];

  for (let i = 0; i < arr.length; i++) {
    const mapped = fn(arr[i], i);

    if (!Array.isArray(mapped)) {
      throw new TypeError(`Expected callback to return an Array, but received ${mapped === null ? 'null' : typeof mapped} at index ${i}`);
    }

    for (let j = 0; j < mapped.length; j++) {
      result.push(mapped[j]);
    }
  }

  return result;
}