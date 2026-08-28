// bloom-deps:

export function parseMultiValueHeader(header: unknown): string[] {
  if (typeof header !== 'string') {
    throw new TypeError('header must be a string');
  }

  const trimmed = header.trim();
  if (trimmed.length === 0) {
    return [];
  }

  const segments = trimmed.split(',');
  const result: string[] = [];

  for (const segment of segments) {
    const trimmedSegment = segment.trim();
    if (trimmedSegment.length > 0) {
      result.push(trimmedSegment);
    }
  }

  return result;
}