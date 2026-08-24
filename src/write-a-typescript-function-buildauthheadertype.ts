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

function buildAuthHeader(type: unknown, credentials: unknown): string {
  // Validate type parameter
  if (typeof type !== 'string') {
    throw new TypeError('type must be a string');
  }

  if (type !== 'Basic' && type !== 'Bearer') {
    throw new TypeError(`type must be 'Basic' or 'Bearer', got '${type}'`);
  }

  // Handle Basic auth
  if (type === 'Basic') {
    // Validate credentials shape for Basic auth
    if (
      credentials === null ||
      credentials === undefined ||
      typeof credentials !== 'object' ||
      Array.isArray(credentials)
    ) {
      throw new TypeError(
        'credentials must be an object with username and password fields for Basic auth'
      );
    }

    const credentialsObj = credentials as Record<string, unknown>;

    // Validate username field exists and is a string
    if (typeof credentialsObj.username !== 'string') {
      throw new TypeError(
        'credentials.username must be a non-empty string for Basic auth'
      );
    }

    // Validate password field exists and is a string
    if (typeof credentialsObj.password !== 'string') {
      throw new TypeError(
        'credentials.password must be a non-empty string for Basic auth'
      );
    }

    const username = credentialsObj.username;
    const password = credentialsObj.password;

    // Check for empty strings
    if (username.length === 0) {
      throw new RangeError('username cannot be empty');
    }

    if (password.length === 0) {
      throw new RangeError('password cannot be empty');
    }

    const encoded = Buffer.from(`${username}:${password}`).toString('base64');
    return `Basic ${encoded}`;
  }

  // Handle Bearer auth
  if (type === 'Bearer') {
    // Validate credentials is a non-empty string for Bearer auth
    if (typeof credentials !== 'string') {
      throw new TypeError('credentials must be a non-empty string token for Bearer auth');
    }

    const token = credentials;

    // Check for empty string
    if (token.length === 0) {
      throw new RangeError('token cannot be empty');
    }

    return `Bearer ${token}`;
  }

  // This line should never be reached due to earlier type checks
  throw new TypeError(`type must be 'Basic' or 'Bearer'`);
}

export { buildAuthHeader, ServiceError };