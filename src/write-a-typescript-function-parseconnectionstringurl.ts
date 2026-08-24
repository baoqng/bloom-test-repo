// bloom-deps:

export interface ParsedConnectionString {
  protocol: string;
  user: string | null;
  password: string | null;
  host: string;
  port: number | null;
  database: string;
  ssl: boolean;
  params: Record<string, string>;
}

function percentDecode(encoded: string): string {
  try {
    return decodeURIComponent(encoded);
  } catch {
    return encoded;
  }
}

export function parseConnectionString(url: unknown): ParsedConnectionString {
  // Validate input type
  if (typeof url !== 'string') {
    throw new TypeError('url must be a string');
  }

  // Check for protocol separator
  const protocolIndex = url.indexOf('://');
  if (protocolIndex === -1) {
    throw new SyntaxError('Invalid connection string: missing protocol');
  }

  // Extract protocol
  const protocol = url.substring(0, protocolIndex);

  // Remove protocol from URL
  let remaining = url.substring(protocolIndex + 3);

  // Find query string start
  const queryIndex = remaining.indexOf('?');
  let queryString = '';
  if (queryIndex !== -1) {
    queryString = remaining.substring(queryIndex + 1);
    remaining = remaining.substring(0, queryIndex);
  }

  // Find path start (database)
  const pathIndex = remaining.indexOf('/');
  let databasePath = '';
  let hostSection = remaining;

  if (pathIndex !== -1) {
    hostSection = remaining.substring(0, pathIndex);
    databasePath = remaining.substring(pathIndex + 1);
  }

  // Parse credentials
  let user: string | null = null;
  let password: string | null = null;

  const atIndex = hostSection.lastIndexOf('@');
  if (atIndex !== -1) {
    const credentials = hostSection.substring(0, atIndex);
    hostSection = hostSection.substring(atIndex + 1);

    const colonIndex = credentials.indexOf(':');
    if (colonIndex !== -1) {
      user = percentDecode(credentials.substring(0, colonIndex));
      password = percentDecode(credentials.substring(colonIndex + 1));
    } else {
      user = percentDecode(credentials);
      password = null;
    }
  }

  // Parse host and port
  let host = hostSection;
  let port: number | null = null;

  const lastColonIndex = hostSection.lastIndexOf(':');
  if (lastColonIndex !== -1) {
    const potentialPort = hostSection.substring(lastColonIndex + 1);
    const portNum = parseInt(potentialPort, 10);

    // Validate port is a valid integer in range 1-65535
    if (
      potentialPort.length > 0 &&
      Number.isInteger(portNum) &&
      portNum >= 1 &&
      portNum <= 65535
    ) {
      host = hostSection.substring(0, lastColonIndex);
      port = portNum;
    } else if (potentialPort.length > 0 && !isNaN(portNum)) {
      // Port is a number but out of valid range
      throw new RangeError('Invalid port');
    }
  }

  // Parse database (percent-decoded, with leading slash stripped)
  const database = percentDecode(databasePath);

  // Parse query parameters
  const params: Record<string, string> = {};
  if (queryString) {
    const pairs = queryString.split('&');
    for (const pair of pairs) {
      const eqIndex = pair.indexOf('=');
      if (eqIndex !== -1) {
        const key = percentDecode(pair.substring(0, eqIndex));
        const value = percentDecode(pair.substring(eqIndex + 1));
        params[key] = value;
      } else {
        const key = percentDecode(pair);
        params[key] = '';
      }
    }
  }

  // Determine SSL setting
  const ssl = params['ssl'] === 'true' || params['sslmode'] === 'require';

  return {
    protocol,
    user,
    password,
    host,
    port,
    database,
    ssl,
    params,
  };
}