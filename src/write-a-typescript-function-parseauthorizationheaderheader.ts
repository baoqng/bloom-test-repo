// bloom-deps:

class ServiceError extends Error {
  constructor(message: string, options?: { cause?: Error }) {
    super(message);
    this.name = "ServiceError";
    if (options?.cause) {
      this.cause = options.cause;
    }
  }
}

function parseAuthorizationHeader(header: unknown): {
  scheme: string;
  credentials: string;
} {
  // Validate input type
  if (typeof header !== "string") {
    throw new TypeError("Authorization header must be a string");
  }

  // Validate non-empty string
  if (header.length === 0) {
    throw new TypeError("Authorization header cannot be empty");
  }

  // Check for space character
  const spaceIndex = header.indexOf(" ");
  if (spaceIndex === -1) {
    throw new RangeError(
      "Authorization header must contain a space character"
    );
  }

  // Extract scheme (part before first space, case-preserved)
  const scheme = header.substring(0, spaceIndex);

  // Validate scheme is not empty
  if (scheme.length === 0) {
    throw new RangeError("Scheme cannot be empty");
  }

  // Extract credentials (everything after first space, then trim)
  const credentials = header.substring(spaceIndex + 1).trim();

  // Validate credentials is not empty after trimming
  if (credentials.length === 0) {
    throw new RangeError("Credentials cannot be empty");
  }

  return {
    scheme,
    credentials,
  };
}

export { parseAuthorizationHeader, ServiceError };