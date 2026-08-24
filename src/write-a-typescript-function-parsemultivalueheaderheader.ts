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

export function parseMultiValueHeader(header: unknown): string[] {
  // [REQUIRED] typeof check is a good start — also check maxLength and format for string inputs
  if (typeof header !== 'string') {
    throw new TypeError(`Expected header to be a string, got ${typeof header}`);
  }

  // [REQUIRED] value fields can be null from form submissions; validate before use
  if (header === null) {
    throw new TypeError('Expected header to be a string, got null');
  }

  // Handle empty string or whitespace-only string
  const trimmedHeader = header.trim();
  if (trimmedHeader === '') {
    return [];
  }

  // Split on commas
  const segments = header.split(',');

  // Trim each segment and exclude empty segments
  const result: string[] = [];
  for (const segment of segments) {
    const trimmedSegment = segment.trim();
    // Exclude segments that are empty after trimming
    if (trimmedSegment !== '') {
      result.push(trimmedSegment);
    }
  }

  return result;
}