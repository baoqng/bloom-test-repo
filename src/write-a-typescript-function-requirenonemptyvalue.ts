// bloom-deps:

export function requireNonEmpty(value: string, fieldName: string): string {
  if (typeof value !== "string") {
    throw new TypeError(`${fieldName} must be a string`);
  }

  if (value.length === 0) {
    throw new Error(`${fieldName} must not be empty`);
  }

  if (value.trim().length === 0) {
    throw new Error(`${fieldName} must not be whitespace-only`);
  }

  return value;
}