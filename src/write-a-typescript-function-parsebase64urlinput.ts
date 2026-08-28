// bloom-deps:

function parseBase64Url(input: unknown): Buffer {
  if (typeof input !== 'string') {
    throw new TypeError('Input must be a string');
  }

  if (input.length === 0) {
    return Buffer.alloc(0);
  }

  // Validate characters: only A-Z, a-z, 0-9, `-`, `_`, `=` are allowed
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (!/[A-Za-z0-9\-_=]/.test(ch)) {
      throw new SyntaxError(`Invalid base64url: unexpected character at position ${i}`);
    }
  }

  // Normalize: replace `-` with `+` and `_` with `/`
  let normalized = input.replace(/-/g, '+').replace(/_/g, '/');

  // Add padding to make length a multiple of 4
  const remainder = normalized.length % 4;
  if (remainder === 1) {
    // This would be invalid base64, but we add padding and let Buffer handle it
    normalized += '===';
  } else if (remainder === 2) {
    normalized += '==';
  } else if (remainder === 3) {
    normalized += '=';
  }

  return Buffer.from(normalized, 'base64');
}

export { parseBase64Url };