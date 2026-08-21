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
  const rest = url.slice(protocolSeparatorIndex + 3);

  // Split rest into authority+path and query
  let authorityAndPath: string;
  let queryString: string | null = null;

  const questionMarkIndex = rest.indexOf('?');
  if (questionMarkIndex !== -1) {
    authorityAndPath = rest.slice(0, questionMarkIndex);
    queryString = rest.slice(questionMarkIndex + 1);
  } else {
    authorityAndPath = rest;
  }

  // Parse params
  const params: Record<string, string> = {};
  if (queryString !== null && queryString.length > 0) {
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

  // Split authority and path
  let authority: string;
  let databasePath: string = '';

  const slashIndex = authorityAndPath.indexOf('/');
  if (slashIndex !== -1) {
    authority = authorityAndPath.slice(0, slashIndex);
    databasePath = authorityAndPath.slice(slashIndex + 1);
  } else {
    authority = authorityAndPath;
  }

  // Parse database (percent-decoded)
  const database = decodeURIComponent(databasePath);

  // Split credentials from host
  let user: string | null = null;
  let password: string | null = null;
  let hostPart: string;

  const lastAtIndex = authority.lastIndexOf('@');
  if (lastAtIndex !== -1) {
    const credentials = authority.slice(0, lastAtIndex);
    hostPart = authority.slice(lastAtIndex + 1);

    const colonIndex = credentials.indexOf(':');
    if (colonIndex !== -1) {
      user = decodeURIComponent(credentials.slice(0, colonIndex));
      const rawPassword = credentials.slice(colonIndex + 1);
      password = rawPassword.length > 0 ? decodeURIComponent(rawPassword) : null;
    } else {
      user = decodeURIComponent(credentials);
      password = null;
    }
  } else {
    hostPart = authority;
  }

  // Parse host and port
  let host: string;
  let port: number | null = null;

  const lastColonIndex = hostPart.lastIndexOf(':');
  if (lastColonIndex !== -1) {
    // Check if it could be IPv6 (contains '[' and ']')
    const potentialHost = hostPart.slice(0, lastColonIndex);
    const potentialPort = hostPart.slice(lastColonIndex + 1);

    // If the potential port is a number, treat it as port
    if (potentialPort.length > 0 && /^\d+$/.test(potentialPort)) {
      host = potentialHost;
      const portNum = parseInt(potentialPort, 10);
      if (!Number.isInteger(portNum) || portNum < 1 || portNum > 65535) {
        throw new RangeError('Invalid port');
      }
      port = portNum;
    } else if (potentialPort.length > 0) {
      // Non-numeric port string found
      throw new RangeError('Invalid port');
    } else {
      host = hostPart;
      port = null;
    }
  } else {
    host = hostPart;
    port = null;
  }

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