// bloom-deps:

export function validateStrictSlug(slug: unknown, maxLength: unknown): string {
  // Type check for slug
  if (typeof slug !== "string") {
    throw new TypeError("slug must be a string");
  }

  // Type and value check for maxLength
  if (
    typeof maxLength !== "number" ||
    !Number.isFinite(maxLength) ||
    !Number.isInteger(maxLength) ||
    maxLength <= 0
  ) {
    throw new TypeError("maxLength must be a positive integer");
  }

  // Range check for maxLength
  if (maxLength > 500) {
    throw new RangeError("maxLength must not exceed 500");
  }

  // Empty/whitespace check (before trimming)
  if (slug.trim() === "") {
    throw new RangeError("slug must not be empty");
  }

  // Trim
  const trimmed = slug.trim();

  // Length check
  if (trimmed.length > maxLength) {
    throw new RangeError(`slug must not exceed ${maxLength} characters`);
  }

  // Character set check
  if (/[^a-z0-9-]/.test(trimmed)) {
    throw new RangeError("slug must contain only lowercase letters, digits, and hyphens");
  }

  // Leading hyphen check
  if (trimmed.startsWith("-")) {
    throw new RangeError("slug must not start with a hyphen");
  }

  // Trailing hyphen check
  if (trimmed.endsWith("-")) {
    throw new RangeError("slug must not end with a hyphen");
  }

  // Consecutive hyphens check
  if (trimmed.includes("--")) {
    throw new RangeError("slug must not contain consecutive hyphens");
  }

  return trimmed;
}