// bloom-deps:

export function parseETagHeader(header: unknown): { weak: boolean; tag: string } {
  if (typeof header !== 'string') {
    throw new TypeError('header must be a string');
  }

  if (header.trim() === '') {
    throw new RangeError('header must not be empty');
  }

  const trimmed = header.trim();

  const weakMatch = trimmed.match(/^W\/"(.+)"$/);
  if (weakMatch) {
    const tag = weakMatch[1];
    if (tag === '') {
      throw new SyntaxError('ETag opaque tag must not be empty');
    }
    return { weak: true, tag };
  }

  const strongMatch = trimmed.match(/^"(.+)"$/);
  if (strongMatch) {
    const tag = strongMatch[1];
    if (tag === '') {
      throw new SyntaxError('ETag opaque tag must not be empty');
    }
    return { weak: false, tag };
  }

  // Check for empty quoted content specifically
  if (trimmed === '""' || trimmed === 'W/""') {
    throw new SyntaxError('ETag opaque tag must not be empty');
  }

  throw new SyntaxError('ETag must be a quoted string optionally prefixed with W/');
}