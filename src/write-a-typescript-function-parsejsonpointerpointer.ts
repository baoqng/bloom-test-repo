// bloom-deps:

function parseJSONPointer(pointer: unknown): string[] {
  if (typeof pointer !== 'string') {
    throw new TypeError('pointer must be a string');
  }

  if (pointer === '') {
    return [];
  }

  if (pointer[0] !== '/') {
    throw new SyntaxError('non-empty JSON Pointer must start with "/"');
  }

  // Split on '/' — first segment before first '/' is empty, skip it
  const raw = pointer.slice(1).split('/');

  const tokens: string[] = [];

  for (const segment of raw) {
    // Unescape ~1 → '/' first, then ~0 → '~' (order matters per RFC 6901)
    let token = segment.replace(/~1/g, '/').replace(/~0/g, '~');

    // After unescaping, check for bare '~' not followed by '0' or '1'
    // Since we've already replaced valid ~0 and ~1 sequences, any remaining '~'
    // in the unescaped token came from a bare '~' in the original (not ~0 or ~1)
    // We need to check the original segment for invalid ~ sequences
    // A bare '~' in original is one not followed by '0' or '1'
    if (/~(?![01])/.test(segment)) {
      throw new SyntaxError(`invalid escape sequence in token: "${segment}"`);
    }

    // Also check if segment ends with '~' (bare ~ at end)
    // This is already covered by /~(?![01])/ since ~ at end has no following char

    tokens.push(token);
  }

  return tokens;
}

export { parseJSONPointer };