export function lastN_24(arr: unknown[], n: number): unknown[] {
  // Validate inputs
  if (!Array.isArray(arr)) {
    throw new TypeError("First argument must be an array");
  }
  
  if (typeof n !== "number" || !Number.isInteger(n)) {
    throw new TypeError("Second argument must be an integer");
  }
  
  if (n < 0) {
    throw new RangeError("n must be >= 0");
  }
  
  // Return last n elements
  // If n = 0, return empty array
  if (n === 0) {
    return [];
  }
  
  // If n >= arr.length, return the entire array
  if (n >= arr.length) {
    return arr.slice();
  }
  
  return arr.slice(-n);
}