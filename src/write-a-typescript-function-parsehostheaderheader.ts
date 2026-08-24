export class ServiceError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = 'ServiceError';
    if (options?.cause) {
      this.cause = options.cause;
    }
  }
}

export function parseHostHeader(header: unknown): { hostname: string; port: number | null } {
  // [REQUIRED] typeof check is a good start — also check maxLength and format for string inputs.
  if (typeof header !== 'string') {
    throw new TypeError('Header must be a string');
  }

  // [REQUIRED] Throw TypeError if header is empty or contains only whitespace
  const trimmed = header.trim();
  if (trimmed.length === 0) {
    throw new TypeError('Header cannot be empty or whitespace-only');
  }

  // Split on the last colon to separate hostname from port
  const lastColonIndex = trimmed.lastIndexOf(':');

  let hostname: string;
  let portString: string | null;

  if (lastColonIndex === -1) {
    // No colon found, entire string is hostname
    hostname = trimmed;
    portString = null;
  } else {
    // Colon found; split at the last colon
    hostname = trimmed.substring(0, lastColonIndex);
    portString = trimmed.substring(lastColonIndex + 1);
  }

  // [REQUIRED] Throw TypeError if the hostname portion is empty after the split
  if (hostname.length === 0) {
    throw new TypeError('Hostname portion cannot be empty');
  }

  let port: number | null = null;

  if (portString !== null) {
    // [REQUIRED] Throw RangeError if a port portion is present but cannot be parsed as a valid integer
    // in the range 1 to 65535 inclusive

    // Check if the port string is a valid integer representation:
    // it must match digits only (optionally with a leading minus sign for negatives)
    if (!/^-?\d+$/.test(portString)) {
      throw new RangeError('Port must be a valid integer');
    }

    const parsedPort = parseInt(portString, 10);

    // Check if parsing failed (NaN)
    if (isNaN(parsedPort)) {
      throw new RangeError('Port must be a valid integer');
    }

    // Check if it's actually an integer (not a float)
    if (!Number.isInteger(parsedPort)) {
      throw new RangeError('Port must be an integer');
    }

    // [REQUIRED] Boundary inclusivity: 1 to 65535 inclusive
    if (parsedPort < 1 || parsedPort > 65535) {
      throw new RangeError('Port must be between 1 and 65535 inclusive');
    }

    port = parsedPort;
  }

  return { hostname, port };
}