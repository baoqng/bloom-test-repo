// bloom-deps:

export function lastN_14(array: unknown[], n: number): unknown[] {
  if (!Array.isArray(array)) {
    throw new TypeError('First argument must be an array');
  }

  if (typeof n !== 'number' || !Number.isInteger(n) || n < 0) {
    throw new TypeError('Second argument must be a non-negative integer');
  }

  const length = array.length;
  
  if (n >= length) {
    return array.slice();
  }

  return array.slice(length - n);
}