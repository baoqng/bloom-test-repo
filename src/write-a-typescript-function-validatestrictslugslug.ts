// bloom-deps:

function validateStrictSlug(slug: unknown, maxLength: unknown): string {
  if (typeof slug !== "string") {
    throw new TypeError("slug must be a string");
  }

  if (
    typeof maxLength !== "number" ||
    !isFinite(maxLength) ||
    !Number.isInteger(maxLength) ||
    maxLength <= 0
  ) {
    throw new TypeError("maxLength must be a positive integer");
  }

  if (maxLength > 500) {
    throw new RangeError("maxLength must not exceed 500");
  }

  if (!slug.trim()) {
    throw new RangeError("slug must not be empty");
  }

  const trimmed = slug.trim();

  if (trimmed.length > maxLength) {
    throw new RangeError(`slug must not exceed ${maxLength} characters`);
  }

  if (!/^[a-z0-9-]+$/.test(trimmed)) {
    throw new RangeError("slug must contain only lowercase letters, digits, and hyphens");
  }

  if (trimmed.startsWith("-")) {
    throw new RangeError("slug must not start with a hyphen");
  }

  if (trimmed.endsWith("-")) {
    throw new RangeError("slug must not end with a hyphen");
  }

  if (trimmed.includes("--")) {
    throw new RangeError("slug must not contain consecutive hyphens");
  }

  return trimmed;
}

export { validateStrictSlug };