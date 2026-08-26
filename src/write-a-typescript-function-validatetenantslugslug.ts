// bloom-deps:

export function validateTenantSlug(slug: unknown): string {
  // Check if slug is a string
  if (typeof slug !== "string") {
    throw new TypeError("slug must be a string");
  }

  // Check length
  if (slug.length < 3 || slug.length > 63) {
    throw new RangeError("slug must be between 3 and 63 characters");
  }

  // Check for valid characters (a-z, 0-9, hyphen only)
  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new RangeError(
      "slug must contain only lowercase letters, digits, and hyphens"
    );
  }

  // Check if starts or ends with hyphen
  if (slug.startsWith("-") || slug.endsWith("-")) {
    throw new RangeError("slug must not start or end with a hyphen");
  }

  // Check for consecutive hyphens
  if (slug.includes("--")) {
    throw new RangeError("slug must not contain consecutive hyphens");
  }

  return slug;
}