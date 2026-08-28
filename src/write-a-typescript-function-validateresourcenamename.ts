// bloom-deps:

export function validateResourceName(name: unknown): string {
  if (typeof name !== "string") {
    throw new TypeError("name must be a string");
  }

  if (!name.trim()) {
    throw new RangeError("name must not be empty");
  }

  const trimmed = name.trim();

  if (trimmed.length > 255) {
    throw new RangeError("name must not exceed 255 characters");
  }

  if (!/^[A-Za-z]/.test(trimmed)) {
    throw new RangeError("name must start with a letter");
  }

  if (/[^A-Za-z0-9\-_]/.test(trimmed)) {
    throw new RangeError("name must contain only letters, digits, hyphens, and underscores");
  }

  return trimmed;
}