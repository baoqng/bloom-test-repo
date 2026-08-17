// bloom-deps:

export function assertNumericType(value: unknown, name: string): void {
  if (typeof name !== 'string' || name.length === 0) {
    throw new TypeError('name must be a non-empty string');
  }
  if (typeof value !== 'number') {
    throw new TypeError(`${name} must be a number`);
  }
}