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

  const protocolSepIndex = url.indexOf('://');
  const protocol = url.slice(0, protocolSepIndex);
  const rest = url.slice(protocolSepIndex + 3);

  // Split query string
  let mainPart = rest;
  let queryString = '';
  const qIndex = rest.indexOf('?');
  if (qIndex !== -1) {
    mainPart = rest.slice(0, qIndex);
    queryString = rest.slice(qIndex + 1);
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

  // Parse credentials and host
  let user: string | null = null;
  let password: string | null = null;
  let hostAndPath = mainPart;

  // Find last '@' for credentials
  const atIndex = mainPart.lastIndexOf('@');
  if (atIndex !== -1) {
    const credentials = mainPart.slice(0, atIndex);
    hostAndPath = mainPart.slice(atIndex + 1);

    const colonIndex = credentials.indexOf(':');
    if (colonIndex === -1) {
      user = decodeURIComponent(credentials);
      password = null;
    } else {
      user = decodeURIComponent(credentials.slice(0, colonIndex));
      password = decodeURIComponent(credentials.slice(colonIndex + 1));
    }
  }

  // Split host from path
  let hostPart = hostAndPath;
  let pathPart = '';
  const slashIndex = hostAndPath.indexOf('/');
  if (slashIndex !== -1) {
    hostPart = hostAndPath.slice(0, slashIndex);
    pathPart = hostAndPath.slice(slashIndex + 1);
  }

  // Parse port from host
  let host = hostPart;
  let port: number | null = null;

  const lastColonIndex = hostPart.lastIndexOf(':');
  if (lastColonIndex !== -1) {
    const potentialPort = hostPart.slice(lastColonIndex + 1);
    const potentialHost = hostPart.slice(0, lastColonIndex);

    // Check if this looks like a port (not IPv6 bracket notation handled separately)
    const portNum = parseInt(potentialPort, 10);
    if (
      potentialPort.length > 0 &&
      /^\d+$/.test(potentialPort)
    ) {
      if (!Number.isInteger(portNum) || portNum < 1 || portNum > 65535) {
        throw new RangeError('Invalid port');
      }
      port = portNum;
      host = potentialHost;
    } else if (potentialPort.length > 0) {
      // Non-numeric after last colon — could be invalid port
      throw new RangeError('Invalid port');
    }
  }

  // Parse database from path
  const database = decodeURIComponent(pathPart);

  // Determine SSL
  const ssl =
    params['ssl'] === 'true' || params['sslmode'] === 'require';

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