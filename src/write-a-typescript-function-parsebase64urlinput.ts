// bloom-deps:

function parseBase64Url(input: unknown): Buffer {
  if (typeof input !== 'string') {
    throw new TypeError('Input must be a string');
  }

  if (input.length === 0) {
    return Buffer.alloc(0);
  }

  const base64urlPattern = /^[A-Za-z0-9\-_=]*$/;
  if (!base64urlPattern.test(input)) {
    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      if (!/[A-Za-z0-9\-_=]/.test(char)) {
        throw new SyntaxError(`Invalid base64url: unexpected character at position ${i}`);
      }
    }
  }

  let normalized = input.replace(/-/g, '+').replace(/_/g, '/');

  const remainder = normalized.length % 4;
  if (remainder === 1) {
    // This is an invalid length for base64, but we add padding and let decode handle it
    normalized += '===';
  } else if (remainder === 2) {
    normalized += '==';
  } else if (remainder === 3) {
    normalized += '=';
  }

  return Buffer.from(normalized, 'base64');
}

export { parseBase64Url };