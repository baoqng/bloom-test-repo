// bloom-deps:

function zipWith<A, B, C>(a: A[], b: B[], fn: (x: A, y: B) => C): C[] {
  if (!Array.isArray(a)) {
    throw new TypeError('First argument must be an array');
  }
  if (!Array.isArray(b)) {
    throw new TypeError('Second argument must be an array');
  }
  if (typeof fn !== 'function') {
    throw new TypeError('Third argument must be a function');
  }

  const length = Math.min(a.length, b.length);
  const result: C[] = [];

  for (let i = 0; i < length; i++) {
    result.push(fn(a[i], b[i]));
  }

  return result;
}

export { zipWith };