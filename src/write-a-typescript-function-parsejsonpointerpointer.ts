// bloom-deps:

function parseJSONPointer(pointer: unknown): string[] {
  if (typeof pointer !== 'string') {
    throw new TypeError(`Expected a string, got ${typeof pointer}`);
  }

  if (pointer === '') {
    return [];
  }

  if (!pointer.startsWith('/')) {
    throw new SyntaxError(`Invalid JSON Pointer: non-empty pointer must start with '/'`);
  }

  const segments = pointer.split('/');
  // Drop the first empty segment from the leading '/'
  segments.shift();

  const tokens: string[] = [];

  for (const segment of segments) {
    // Replace ~1 first, then ~0 (order matters per RFC 6901)
    let token = segment.replace(/~1/g, '/').replace(/~0/g, '~');

    // After unescaping, check for any bare '~' not followed by '0' or '1'
    // Since we've already unescaped, any remaining '~' in the original segment
    // that wasn't part of ~0 or ~1 would be invalid.
    // We need to check the original segment for invalid ~ sequences before unescaping.
    // Actually per the contract: "after unescaping" — but after unescaping ~0 and ~1,
    // remaining ~ in token indicates invalid escape in original.
    // Check the original segment for bare ~ sequences
    const invalidEscape = /~(?![01])/;
    if (invalidEscape.test(segment)) {
      throw new SyntaxError(`Invalid escape sequence in JSON Pointer token: '${segment}'`);
    }

    // Also check if token ends with ~ (bare ~ at end of original segment)
    // This is already covered by the regex above since ~ at end has no following char

    tokens.push(token);
  }

  return tokens;
}

export { parseJSONPointer };