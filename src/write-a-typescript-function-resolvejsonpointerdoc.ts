// bloom-deps:

function resolveJsonPointer(doc: unknown, pointer: unknown): unknown {
  // Validate doc: must be a non-null object or array
  if (doc === null || (typeof doc !== 'object' && !Array.isArray(doc))) {
    throw new TypeError('doc must be a non-null object or array');
  }

  // Validate pointer: must be a string
  if (typeof pointer !== 'string') {
    throw new TypeError('pointer must be a string');
  }

  // Empty string means root pointer — return doc unchanged
  if (pointer === '') {
    return doc;
  }

  // Non-empty pointer must start with '/'
  if (pointer[0] !== '/') {
    throw new SyntaxError('JSON Pointer must start with /');
  }

  // Split on '/' and skip the first empty segment (before the leading '/')
  const rawTokens = pointer.slice(1).split('/');

  // Decode each token: replace '~1' with '/' then '~0' with '~' (in that order)
  const tokens = rawTokens.map(token => {
    return token.replace(/~1/g, '/').replace(/~0/g, '~');
  });

  let current: unknown = doc;

  for (const token of tokens) {
    if (current === null || (typeof current !== 'object' && !Array.isArray(current))) {
      throw new RangeError('Pointer references non-existent location');
    }

    if (Array.isArray(current)) {
      // For arrays, token must be a valid index
      const index = Number(token);
      if (!Number.isInteger(index) || index < 0 || String(index) !== token) {
        throw new RangeError('Pointer references non-existent location');
      }
      if (index >= current.length) {
        throw new RangeError('Pointer references non-existent location');
      }
      current = current[index];
    } else {
      // For objects
      const obj = current as Record<string, unknown>;
      if (!Object.prototype.hasOwnProperty.call(obj, token)) {
        throw new RangeError('Pointer references non-existent location');
      }
      current = obj[token];
    }
  }

  return current;
}

export { resolveJsonPointer };