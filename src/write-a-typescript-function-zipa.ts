// bloom-deps:

function zip<A, B>(a: A[], b: B[]): [A, B][] {
  if (!Array.isArray(a)) {
    throw new TypeError('First argument must be an Array');
  }
  if (!Array.isArray(b)) {
    throw new TypeError('Second argument must be an Array');
  }

  const length = Math.min(a.length, b.length);
  const result: [A, B][] = [];

  for (let i = 0; i < length; i++) {
    result.push([a[i], b[i]]);
  }

  return result;
}

export { zip };