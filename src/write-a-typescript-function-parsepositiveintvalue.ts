// bloom-deps:

function parsePositiveInt(value: unknown): number {
  if (typeof value !== 'string') {
    throw new TypeError('Expected a string');
  }
  if (!/^[1-9][0-9]*$/.test(value)) {
    throw new RangeError('Expected a string representing a positive integer');
  }
  return Number(value);
}

export { parsePositiveInt };