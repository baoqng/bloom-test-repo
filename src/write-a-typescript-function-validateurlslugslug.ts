// bloom-deps:

export function validateUrlSlug(slug: unknown): string {
  if (typeof slug !== "string") {
    throw new TypeError("slug must be a string");
  }

  if (slug.trim().length === 0) {
    throw new RangeError("slug must not be empty");
  }

  const trimmed = slug.trim();

  if (trimmed.length < 1 || trimmed.length > 100) {
    throw new RangeError("slug must be between 1 and 100 characters");
  }

  if (!/^[a-z0-9-]+$/.test(trimmed)) {
    throw new RangeError("slug must contain only lowercase letters, digits, and hyphens");
  }

  if (trimmed.startsWith("-") || trimmed.endsWith("-")) {
    throw new RangeError("slug must not start or end with a hyphen");
  }

  if (trimmed.includes("--")) {
    throw new RangeError("slug must not contain consecutive hyphens");
  }

  return trimmed;
}