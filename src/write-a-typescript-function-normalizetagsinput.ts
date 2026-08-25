// bloom-deps:

export function normalizeTags(input: unknown): string[] {
  if (typeof input !== 'string' && !Array.isArray(input)) {
    throw new TypeError('Expected a string or array');
  }

  const rawTags: unknown[] = typeof input === 'string'
    ? input.split(',')
    : input;

  const result: string[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < rawTags.length; i++) {
    const raw = rawTags[i];

    if (typeof raw !== 'string') {
      throw new TypeError(`Tag at index ${i} must be a string`);
    }

    // Step 1: trim whitespace
    let tag = raw.trim();

    // Step 2: lowercase
    tag = tag.toLowerCase();

    // Step 3: replace any run of non-alphanumeric characters (except hyphens) with a single hyphen
    tag = tag.replace(/[^a-z0-9-]+/g, '-');

    // Step 4: strip leading and trailing hyphens
    tag = tag.replace(/^-+|-+$/g, '');

    // Step 5: skip if empty after processing
    if (tag === '') {
      continue;
    }

    // Step 6: check length
    if (tag.length > 50) {
      throw new RangeError('Tag must not exceed 50 characters');
    }

    // Step 7: deduplicate preserving first-occurrence order
    if (!seen.has(tag)) {
      seen.add(tag);
      result.push(tag);
    }
  }

  return result;
}