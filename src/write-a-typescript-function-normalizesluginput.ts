// bloom-deps:

export class ServiceError extends Error {
  constructor(message: string, options?: { cause?: Error }) {
    super(message);
    this.name = 'ServiceError';
    if (options?.cause) {
      this.cause = options.cause;
    }
  }
}

export function normalizeSlug(input: unknown): string {
  // [REQUIRED] typeof check is a good start — also check maxLength and format for string inputs.
  if (typeof input !== 'string') {
    throw new TypeError('Input must be a string');
  }

  // [REQUIRED] value fields can be null from form submissions; validate before use
  if (input === null || input === undefined) {
    throw new TypeError('Input must be a string');
  }

  try {
    // Convert to lowercase
    let slug = input.toLowerCase();

    // Replace spaces and underscores with hyphens
    slug = slug.replace(/[\s_]/g, '-');

    // Remove all characters that are not alphanumeric or hyphens
    slug = slug.replace(/[^a-z0-9-]/g, '');

    // Collapse multiple consecutive hyphens into a single hyphen
    slug = slug.replace(/-+/g, '-');

    // Strip leading and trailing hyphens
    slug = slug.replace(/^-+|-+$/g, '');

    // [REQUIRED] Throw RangeError if the resulting slug is empty after all transformations
    if (slug.length === 0) {
      throw new RangeError('Resulting slug is empty after all transformations');
    }

    return slug;
  } catch (error) {
    if (error instanceof TypeError || error instanceof RangeError) {
      throw error;
    }
    throw new ServiceError('normalizeSlug operation failed', { cause: error as Error });
  }
}