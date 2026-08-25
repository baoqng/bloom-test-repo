// bloom-deps:

export function validateUrlSlug(slug: unknown): string {
  if (typeof slug !== "string") {
    throw new TypeError("Slug must be a string");
  }

  if (slug.length === 0 || slug.length > 100) {
    throw new RangeError("Slug must be between 1 and 100 characters");
  }

  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new SyntaxError("Slug must contain only lowercase letters, digits, and hyphens");
  }

  if (slug.startsWith("-") || slug.endsWith("-")) {
    throw new SyntaxError("Slug must not start or end with a hyphen");
  }

  if (slug.includes("--")) {
    throw new SyntaxError("Slug must not contain consecutive hyphens");
  }

  return slug;
}