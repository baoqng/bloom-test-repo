// bloom-deps:
function addIntegers(a: unknown, b: unknown): number {
  if (typeof a !== 'number' || isNaN(a)) {
    if (typeof a !== 'number') {
      throw new TypeError('a must be a number');
    }
    throw new TypeError('a must be a number');
  }
  if (typeof b !== 'number' || isNaN(b)) {
    if (typeof b !== 'number') {
      throw new TypeError('b must be a number');
    }
    throw new TypeError('b must be a number');
  }
  if (!Number.isInteger(a)) {
    throw new TypeError('a must be an integer');
  }
  if (!Number.isInteger(b)) {
    throw new TypeError('b must be an integer');
  }
  return a + b;
}

export { addIntegers };