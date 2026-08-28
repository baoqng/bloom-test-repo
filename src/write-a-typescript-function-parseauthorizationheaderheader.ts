// bloom-deps:

export function parseAuthorizationHeader(header: unknown): { scheme: string; credentials: string } {
  // Type check: must be a string
  if (typeof header !== 'string') {
    throw new TypeError('Authorization header must be a non-empty string');
  }

  // Empty string check
  if (header.length === 0) {
    throw new TypeError('Authorization header must be a non-empty string');
  }

  // Find the first space character
  const spaceIndex = header.indexOf(' ');

  // No space found
  if (spaceIndex === -1) {
    throw new RangeError('Authorization header must contain a space character');
  }

  // Extract scheme (part before first space) - case preserved
  const scheme = header.slice(0, spaceIndex);

  // Extract credentials (part after first space) and trim
  const credentialsRaw = header.slice(spaceIndex + 1);
  const credentials = credentialsRaw.trim();

  // Validate scheme is not empty
  if (scheme.length === 0) {
    throw new RangeError('Scheme must not be empty');
  }

  // Validate credentials is not empty after trimming
  if (credentials.length === 0) {
    throw new RangeError('Credentials must not be empty');
  }

  return { scheme, credentials };
}