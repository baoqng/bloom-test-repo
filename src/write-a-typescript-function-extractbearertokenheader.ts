// bloom-deps:

export class ServiceError extends Error {
  constructor(
    message: string,
    public context?: { cause?: unknown }
  ) {
    super(message);
    this.name = 'ServiceError';
  }
}

export function extractBearerToken(header: unknown): string {
  // [REQUIRED] typeof check is a good start — also check maxLength and format for string inputs
  if (typeof header !== 'string') {
    throw new TypeError('Authorization header must be a string');
  }

  // [REQUIRED] Check for exactly "Bearer " prefix (case-sensitive, one space)
  const bearerPrefix = 'Bearer ';
  if (!header.startsWith(bearerPrefix)) {
    throw new RangeError(
      'Authorization header must start with exactly "Bearer " (case-sensitive, one space)'
    );
  }

  // Extract token portion after "Bearer "
  const token = header.slice(bearerPrefix.length).trim();

  // [REQUIRED] Throw RangeError if token portion is empty after trimming
  if (token.length === 0) {
    throw new RangeError('Token portion cannot be empty or whitespace-only');
  }

  return token;
}