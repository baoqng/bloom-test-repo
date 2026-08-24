// bloom-deps:

class ServiceError extends Error {
  constructor(message: string, options?: { cause?: Error }) {
    super(message);
    this.name = 'ServiceError';
    if (options?.cause) {
      this.cause = options.cause;
    }
  }
}

function parseAuthorizationHeader(header: unknown): { scheme: string; credentials: string } {
  // Validate input type and non-empty
  if (typeof header !== 'string') {
    throw new TypeError('Authorization header must be a non-empty string');
  }

  if (header.length === 0) {
    throw new TypeError('Authorization header must be a non-empty string');
  }

  // Check for space character
  const spaceIndex = header.indexOf(' ');
  if (spaceIndex === -1) {
    throw new RangeError('Authorization header must contain a space character');
  }

  // Extract scheme (part before first space)
  const scheme = header.substring(0, spaceIndex);

  // Validate scheme is not empty
  if (scheme.length === 0) {
    throw new RangeError('Authorization scheme cannot be empty');
  }

  // Extract credentials (everything after first space, then trim)
  const credentials = header.substring(spaceIndex + 1).trim();

  // Validate credentials is not empty after trimming
  if (credentials.length === 0) {
    throw new RangeError('Authorization credentials cannot be empty');
  }

  return {
    scheme,
    credentials,
  };
}

export { parseAuthorizationHeader, ServiceError };