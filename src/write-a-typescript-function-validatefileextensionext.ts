// bloom-deps:

export function validateFileExtension(ext: unknown): string {
  if (typeof ext !== "string") {
    throw new TypeError("ext must be a string");
  }

  if (!ext.trim()) {
    throw new RangeError("ext must not be empty");
  }

  const trimmed = ext.trim();

  if (!trimmed.startsWith(".")) {
    throw new RangeError("ext must start with '.'");
  }

  if (trimmed.length === 1) {
    throw new RangeError("ext must have at least one character after the dot");
  }

  const afterDot = trimmed.slice(1);

  if (afterDot.length > 10) {
    throw new RangeError("ext must not exceed 10 characters after the dot");
  }

  if (!/^[a-zA-Z0-9]+$/.test(afterDot)) {
    throw new RangeError("ext must contain only letters and digits after the dot");
  }

  return trimmed.toLowerCase();
}