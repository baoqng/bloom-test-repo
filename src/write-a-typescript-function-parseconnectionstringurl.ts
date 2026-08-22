// bloom-deps:

export function parseConnectionString(url: unknown): {
  protocol: string;
  user: string | null;
  password: string | null;
  host: string;
  port: number | null;
  database: string;
  ssl: boolean;
  params: Record<string, string>;
} {
  if (typeof url !== 'string') {
    throw new TypeError('url must be a string');
  }

  if (!url.includes('://')) {
    throw new SyntaxError('Invalid connection string: missing protocol');
  }

  const protocolSeparatorIndex = url.indexOf('://');
  const protocol = url.slice(0, protocolSeparatorIndex);
  let rest = url.slice(protocolSeparatorIndex + 3);

  // Split off query string
  let queryString = '';
  const queryIndex = rest.indexOf('?');
  if (queryIndex !== -1) {
    queryString = rest.slice(queryIndex + 1);
    rest = rest.slice(0, queryIndex);
  }

  // Parse params
  const params: Record<string, string> = {};
  if (queryString.length > 0) {
    const pairs = queryString.split('&');
    for (const pair of pairs) {
      if (pair.length === 0) continue;
      const eqIndex = pair.indexOf('=');
      if (eqIndex === -1) {
        const key = decodeURIComponent(pair);
        if (key.length > 0) {
          params[key] = '';
        }
      } else {
        const key = decodeURIComponent(pair.slice(0, eqIndex));
        const value = decodeURIComponent(pair.slice(eqIndex + 1));
        if (key.length > 0) {
          params[key] = value;
        }
      }
    }
  }

  // Determine ssl
  const ssl =
    params['ssl'] === 'true' || params['sslmode'] === 'require';

  // Find credentials and host
  let user: string | null = null;
  let password: string | null = null;

  // Split path from host
  const slashIndex = rest.indexOf('/');
  let hostSection: string;
  let pathSection: string;

  if (slashIndex !== -1) {
    hostSection = rest.slice(0, slashIndex);
    pathSection = rest.slice(slashIndex + 1);
  } else {
    hostSection = rest;
    pathSection = '';
  }

  // Find last '@' in hostSection
  const lastAtIndex = hostSection.lastIndexOf('@');
  let hostAndPort: string;

  if (lastAtIndex !== -1) {
    const credentials = hostSection.slice(0, lastAtIndex);
    hostAndPort = hostSection.slice(lastAtIndex + 1);

    // Split credentials on first ':'
    const credColonIndex = credentials.indexOf(':');
    if (credColonIndex === -1) {
      user = decodeURIComponent(credentials);
      password = null;
    } else {
      user = decodeURIComponent(credentials.slice(0, credColonIndex));
      password = decodeURIComponent(credentials.slice(credColonIndex + 1));
    }
  } else {
    hostAndPort = hostSection;
  }

  // Parse host and port from hostAndPort
  let host: string;
  let port: number | null = null;

  const lastColonIndex = hostAndPort.lastIndexOf(':');
  if (lastColonIndex !== -1) {
    const potentialPort = hostAndPort.slice(lastColonIndex + 1);
    const potentialHost = hostAndPort.slice(0, lastColonIndex);

    // Check if this looks like a port (digits only)
    if (/^\d+$/.test(potentialPort)) {
      const portNum = parseInt(potentialPort, 10);
      if (!Number.isInteger(portNum) || portNum < 1 || portNum > 65535) {
        throw new RangeError('Invalid port');
      }
      port = portNum;
      host = potentialHost;
    } else {
      // Could be IPv6 or something else without a port
      host = hostAndPort;
      port = null;
    }
  } else {
    host = hostAndPort;
    port = null;
  }

  // Parse database
  const database = decodeURIComponent(pathSection);

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