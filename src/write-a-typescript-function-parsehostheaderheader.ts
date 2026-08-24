// bloom-deps:

export class ServiceError extends Error {
  constructor(message: string, options?: { cause?: Error }) {
    super(message);
    this.name = 'ServiceError';
    if (options?.cause) {
      this.cause = options.cause;
    }
  }
}

export function parseHostHeader(header: unknown): { hostname: string; port: number | null } {
  // Validate input type
  if (typeof header !== 'string') {
    throw new TypeError('Host header must be a string');
  }

  // Validate non-empty and non-whitespace
  const trimmed = header.trim();
  if (trimmed.length === 0) {
    throw new TypeError('Host header cannot be empty or whitespace-only');
  }

  // Find the last colon to split hostname and port
  const lastColonIndex = header.lastIndexOf(':');

  if (lastColonIndex === -1) {
    // No port portion present
    const hostname = header.trim();
    if (hostname.length === 0) {
      throw new TypeError('Hostname portion cannot be empty');
    }
    return { hostname, port: null };
  }

  // Split on the last colon
  const hostname = header.substring(0, lastColonIndex).trim();
  const portString = header.substring(lastColonIndex + 1).trim();

  // Validate hostname is not empty
  if (hostname.length === 0) {
    throw new TypeError('Hostname portion cannot be empty');
  }

  // Validate and parse port
  const portNumber = parseInt(portString, 10);

  // Check if port is a valid integer
  if (isNaN(portNumber)) {
    throw new RangeError('Port must be a valid integer');
  }

  // Check if port is within valid range (1 to 65535 inclusive)
  if (portNumber < 1 || portNumber > 65535) {
    throw new RangeError('Port must be in the range 1 to 65535 inclusive');
  }

  // Check if the parsed port matches the original string (no decimals or other invalid formats)
  if (portNumber.toString() !== portString) {
    throw new RangeError('Port must be a valid integer');
  }

  return { hostname, port: portNumber };
}