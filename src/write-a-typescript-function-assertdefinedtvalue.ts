// bloom-deps:

function assertDefined<T>(value: T | null | undefined, fieldName: string): T {
  if (typeof fieldName !== 'string') {
    throw new TypeError('fieldName must be a string');
  }
  if (value === null || value === undefined) {
    throw new Error(`${fieldName} must not be null or undefined`);
  }
  return value;
}

export { assertDefined };