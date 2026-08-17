// bloom-deps:

function toNumberOrThrow(value: unknown): number {
  if (typeof value === 'number') {
    return value;
  }
  throw new TypeError('expected a number');
}

export { toNumberOrThrow };