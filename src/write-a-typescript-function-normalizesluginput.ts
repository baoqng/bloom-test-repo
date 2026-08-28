// bloom-deps:

function normalizeSlug(input: unknown): string {
  if (typeof input !== "string") {
    throw new TypeError("input must be a string");
  }

  let slug = input.toLowerCase();
  slug = slug.replace(/[ _]/g, "-");
  slug = slug.replace(/[^a-z0-9-]/g, "");
  slug = slug.replace(/-+/g, "-");
  slug = slug.replace(/^-+|-+$/g, "");

  if (slug.length === 0) {
    throw new RangeError("resulting slug is empty after all transformations");
  }

  return slug;
}

export { normalizeSlug };