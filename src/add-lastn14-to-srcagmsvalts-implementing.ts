export function lastN_14(array: unknown[], n: number): unknown[] {
  if (n < 0) {
    throw new Error('n must be >= 0');
  }
  
  if (!Array.isArray(array)) {
    throw new Error('First argument must be an array');
  }
  
  n = Math.floor(n);
  
  if (n === 0) {
    return [];
  }
  
  if (n >= array.length) {
    return array.slice();
  }
  
  return array.slice(array.length - n);
}