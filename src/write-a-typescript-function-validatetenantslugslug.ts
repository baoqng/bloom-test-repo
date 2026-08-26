// bloom-deps:

function validateTenantSlug(slug: unknown): string {
  // Check if slug is a string
  if (typeof slug !== "string") {
    throw new TypeError("slug must be a string");
  }

  // Check length is between 3 and 63 characters
  if (slug.length < 3 || slug.length > 63) {
    throw new RangeError("slug must be between 3 and 63 characters");
  }

  // Check if slug contains only lowercase letters, digits, and hyphens
  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new RangeError(
      "slug must contain only lowercase letters, digits, and hyphens"
    );
  }

  // Check if slug starts or ends with a hyphen
  if (slug.startsWith("-") || slug.endsWith("-")) {
    throw new RangeError("slug must not start or end with a hyphen");
  }

  // Check if slug contains consecutive hyphens
  if (slug.includes("--")) {
    throw new RangeError("slug must not contain consecutive hyphens");
  }

  // All validation passed, return the slug
  return slug;
}

export { validateTenantSlug };