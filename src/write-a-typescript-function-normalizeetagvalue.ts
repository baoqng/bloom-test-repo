// bloom-deps:

export function normalizeEtag(value: unknown): { tag: string; weak: boolean } {
  // Compute feedback independently before applying force-zero score rules
  if (typeof value !== 'string') {
    throw new TypeError('Expected a string');
  }

  const trimmedValue = value.trim();
  let weak = false;
  let quotedPart = trimmedValue;

  // Check for weak ETag prefix
  if (trimmedValue.startsWith('W/')) {
    weak = true;
    quotedPart = trimmedValue.slice(2);
  }

  // Validate that quotedPart is a properly quoted string
  if (!quotedPart.startsWith('"') || !quotedPart.endsWith('"')) {
    throw new SyntaxError('Invalid ETag');
  }

  // Extract the unquoted contents
  const tag = quotedPart.slice(1, -1);

  // Check that quoted string contents are not empty
  if (tag.length === 0) {
    throw new SyntaxError('Invalid ETag');
  }

  // Validate that the tag contains only valid characters (no unescaped quotes)
  // Valid opaque tag: any characters except unescaped double-quotes
  for (let i = 0; i < tag.length; i++) {
    if (tag[i] === '"') {
      // Check if it's escaped (preceded by backslash)
      if (i === 0 || tag[i - 1] !== '\\') {
        throw new SyntaxError('Invalid ETag');
      }
    }
  }

  return { tag, weak };
}