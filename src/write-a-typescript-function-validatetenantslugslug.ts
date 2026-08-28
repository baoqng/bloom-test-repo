// bloom-deps:

export function validateTenantSlug(slug: unknown): string {
  if (typeof slug !== "string") {
    throw new TypeError("slug must be a string");
  }

  if (slug.length < 3 || slug.length > 63) {
    throw new RangeError("slug must be between 3 and 63 characters");
  }

  if (/[^a-z0-9-]/.test(slug)) {
    throw new RangeError("slug must contain only lowercase letters, digits, and hyphens");
  }

  if (slug.startsWith("-") || slug.endsWith("-")) {
    throw new RangeError("slug must not start or end with a hyphen");
  }

  if (/--/.test(slug)) {
    throw new RangeError("slug must not contain consecutive hyphens");
  }

  return slug;
}