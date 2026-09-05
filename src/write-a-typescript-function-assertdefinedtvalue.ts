// bloom-deps:

export function assertDefined<T>(value: T | undefined, name: string): T {
  if (typeof name !== 'string') {
    throw new TypeError('name must be a string');
  }
  if (value === undefined) {
    throw new Error(`${name} is undefined`);
  }
  return value;
}