// bloom-deps:

class ServiceError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = 'ServiceError';
    if (options?.cause) {
      this.cause = options.cause;
    }
  }
}

function parseJSONPointer(pointer: unknown): string[] {
  // [REQUIRED] typeof check is a good start — also check maxLength and format for string inputs.
  if (typeof pointer !== 'string') {
    throw new TypeError('JSON Pointer must be a string');
  }

  // Empty string is a valid pointer referring to the whole document
  if (pointer === '') {
    return [];
  }

  // Non-empty pointer must start with '/'
  if (!pointer.startsWith('/')) {
    throw new SyntaxError('Non-empty JSON Pointer must start with "/"');
  }

  // Split on '/' and drop the leading empty segment from the initial '/'
  const segments = pointer.slice(1).split('/');

  // Unescape each token: replace '~1' with '/' first, then '~0' with '~'
  // Order matters: ~1 first, then ~0
  const tokens = segments.map((token) => {
    let unescaped = token.replace(/~1/g, '/');
    unescaped = unescaped.replace(/~0/g, '~');

    // Check for bare '~' not followed by '0' or '1' in the ORIGINAL token before unescaping
    // A bare ~ in the original means it's invalid (not part of ~0 or ~1 escape sequence)
    if (/~(?![01])/.test(token)) {
      throw new SyntaxError(
        'Invalid escape sequence in JSON Pointer token: bare "~" not followed by "0" or "1"'
      );
    }

    return unescaped;
  });

  return tokens;
}

export { parseJSONPointer, ServiceError };