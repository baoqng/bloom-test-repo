// bloom-deps:

export function parseSlug(input: unknown): string {
  // Type validation: must be a non-empty string
  if (typeof input !== 'string' || input.length === 0) {
    throw new TypeError('input must be a non-empty string');
  }

  // Normalise: trim, lowercase, replace non-alphanumeric sequences with hyphens
  const trimmed = input.trim().toLowerCase();
  
  // Replace sequences of one or more non-alphanumeric characters with a single hyphen
  const replaced = trimmed.replace(/[^a-z0-9]+/g, '-');
  
  // Strip leading and trailing hyphens
  const normalised = replaced.replace(/^-+|-+$/g, '');
  
  // Check if empty after normalisation
  if (normalised.length === 0) {
    throw new RangeError('Slug is empty after normalisation');
  }
  
  // Check if exceeds 100 characters
  if (normalised.length > 100) {
    throw new RangeError('Slug exceeds 100 characters');
  }
  
  return normalised;
}