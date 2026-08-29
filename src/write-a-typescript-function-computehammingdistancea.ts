// bloom-deps:

function computeHammingDistance(a: unknown, b: unknown): number {
  if (typeof a !== 'string') {
    throw new TypeError('a must be a string');
  }
  if (typeof b !== 'string') {
    throw new TypeError('b must be a string');
  }
  if (a.length !== b.length) {
    throw new RangeError('Strings must have equal length');
  }
  let distance = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      distance++;
    }
  }
  return distance;
}

export { computeHammingDistance };