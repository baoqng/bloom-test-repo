// bloom-deps:

export function requireNumeric(values: unknown[]): number[] {
  for (let i = 0; i < values.length; i++) {
    if (typeof values[i] !== 'number') {
      throw new TypeError('all values must be numbers');
    }
  }
  return values as number[];
}