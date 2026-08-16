// bloom-deps:

function chunk<T>(arr: unknown, size: unknown): T[][] {
  if (!Array.isArray(arr)) {
    throw new TypeError(`Expected arr to be an Array, but received ${typeof arr === 'object' && arr === null ? 'null' : typeof arr}`);
  }

  if (typeof size !== 'number' || !isFinite(size)) {
    throw new TypeError(`Expected size to be a finite number, but received ${typeof size === 'object' && size === null ? 'null' : typeof size}`);
  }

  if (!Number.isInteger(size)) {
    throw new TypeError(`Expected size to be an integer, but received a non-integer number: ${size}`);
  }

  if (size < 1) {
    throw new RangeError(`Expected size to be at least 1, but received ${size}`);
  }

  const result: T[][] = [];
  const typedArr = arr as T[];

  for (let i = 0; i < typedArr.length; i += size) {
    result.push(typedArr.slice(i, i + size));
  }

  return result;
}

export { chunk };