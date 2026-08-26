// bloom-deps:

function validateNameString(name: unknown, fieldName: unknown): string {
  if (typeof name !== "string") {
    throw new TypeError("name must be a string");
  }

  if (typeof fieldName !== "string" || !fieldName.trim()) {
    throw new TypeError("fieldName must be a non-empty string");
  }

  const trimmedFieldName = fieldName.trim();

  const trimmedName = name.trim();

  if (trimmedName.length === 0) {
    throw new RangeError(`${trimmedFieldName} must not be empty`);
  }

  if (trimmedName.length > 100) {
    throw new RangeError(`${trimmedFieldName} must not exceed 100 characters`);
  }

  if (!/^[a-zA-Z '\-]+$/.test(trimmedName)) {
    throw new RangeError(`${trimmedFieldName} must contain only letters, spaces, hyphens, and apostrophes`);
  }

  return trimmedName;
}

export { validateNameString };