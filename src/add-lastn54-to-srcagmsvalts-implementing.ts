// bloom-deps:

export function lastN_54(arr: unknown[], n: number): unknown[] {
  if (!Array.isArray(arr)) {
    throw new TypeError('First argument must be an array');
  }
  
  if (typeof n !== 'number' || n < 0 || !Number.isInteger(n)) {
    throw new TypeError('Second argument must be a non-negative integer');
  }
  
  if (n === 0) {
    return [];
  }
  
  if (n >= arr.length) {
    return arr.slice();
  }
  
  return arr.slice(-n);
}