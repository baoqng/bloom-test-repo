// bloom-deps:

export function zipWith<A, B, C>(
  a: A[],
  b: B[],
  fn: (x: A, y: B) => C
): C[] {
  // Validate that a is an Array
  if (!Array.isArray(a)) {
    throw new TypeError('a must be an Array');
  }

  // Validate that b is an Array
  if (!Array.isArray(b)) {
    throw new TypeError('b must be an Array');
  }

  // Validate that fn is a function
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }

  // Determine the length of the shorter array
  const length = Math.min(a.length, b.length);

  // Build result array by applying fn to each pair
  const result: C[] = [];
  for (let i = 0; i < length; i++) {
    result.push(fn(a[i], b[i]));
  }

  return result;
}