// bloom-deps:

function assertNonNull<T>(value: T | null | undefined, name: string): T {
  // Validate name parameter
  if (typeof name !== 'string' || name.trim().length === 0) {
    throw new TypeError('name must be a non-empty string');
  }

  // Check if value is null or undefined
  if (value === null || value === undefined) {
    throw new Error(`'${name}' must not be null or undefined`);
  }

  return value;
}

export { assertNonNull };