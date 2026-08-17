// bloom-deps:

export function assertNonNull<T>(value: T | null | undefined, name: string): T {
  if (typeof name !== 'string' || name.length === 0 || name.trim().length === 0) {
    throw new TypeError(`name must be a non-empty string`);
  }

  if (value === null || value === undefined) {
    throw new Error(`${name} must not be null or undefined`);
  }

  return value;
}