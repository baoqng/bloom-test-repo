// bloom-deps:

function normalizeTags(input: unknown): string[] {
  if (typeof input !== 'string' && !Array.isArray(input)) {
    throw new TypeError("Expected a string or array");
  }

  const rawTags: unknown[] = typeof input === 'string'
    ? input.split(',')
    : input;

  const result: string[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < rawTags.length; i++) {
    const element = rawTags[i];

    if (typeof element !== 'string') {
      throw new TypeError(`Tag at index ${i} must be a string`);
    }

    // Trim whitespace and lowercase
    let tag = element.trim().toLowerCase();

    // Replace any run of non-alphanumeric characters (except hyphens) with a single hyphen
    tag = tag.replace(/[^a-z0-9-]+/g, '-');

    // Strip leading and trailing hyphens
    tag = tag.replace(/^-+|-+$/g, '');

    // Skip empty tags
    if (tag.length === 0) {
      continue;
    }

    // Check length constraint
    if (tag.length > 50) {
      throw new RangeError("Tag must not exceed 50 characters");
    }

    // Deduplicate preserving first-occurrence order
    if (!seen.has(tag)) {
      seen.add(tag);
      result.push(tag);
    }
  }

  return result;
}

export { normalizeTags };