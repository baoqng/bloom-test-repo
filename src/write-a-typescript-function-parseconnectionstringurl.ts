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

  // Split rest into host+path portion and query string
  const queryIndex = rest.indexOf('?');
  let beforeQuery: string;
  let queryString: string;

  if (queryIndex !== -1) {
    beforeQuery = rest.slice(0, queryIndex);
    queryString = rest.slice(queryIndex + 1);
  } else {
    beforeQuery = rest;
    queryString = '';
  }

  // Parse params from query string
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

  // Find credentials vs host/path
  let user: string | null = null;
  let password: string | null = null;
  let hostAndPath: string;

  const lastAtIndex = beforeQuery.lastIndexOf('@');
  if (lastAtIndex !== -1) {
    const credentialsPart = beforeQuery.slice(0, lastAtIndex);
    hostAndPath = beforeQuery.slice(lastAtIndex + 1);

    // Parse credentials: split on first ':'
    const credColonIndex = credentialsPart.indexOf(':');
    if (credColonIndex === -1) {
      user = decodeURIComponent(credentialsPart);
      password = null;
    } else {
      user = decodeURIComponent(credentialsPart.slice(0, credColonIndex));
      password = decodeURIComponent(credentialsPart.slice(credColonIndex + 1));
    }
  } else {
    hostAndPath = beforeQuery;
  }

  // Split hostAndPath into host section and path
  const slashIndex = hostAndPath.indexOf('/');
  let hostSection: string;
  let pathSection: string;

  if (slashIndex !== -1) {
    hostSection = hostAndPath.slice(0, slashIndex);
    pathSection = hostAndPath.slice(slashIndex + 1);
  } else {
    hostSection = hostAndPath;
    pathSection = '';
  }

  // Parse host and port
  let host: string;
  let port: number | null = null;

  const lastColonInHost = hostSection.lastIndexOf(':');
  if (lastColonInHost !== -1) {
    const potentialPort = hostSection.slice(lastColonInHost + 1);
    const potentialHost = hostSection.slice(0, lastColonInHost);
    const portNum = parseInt(potentialPort, 10);
    if (!Number.isInteger(portNum) || portNum < 1 || portNum > 65535 || String(portNum) !== potentialPort) {
      throw new RangeError('Invalid port');
    }
    host = potentialHost;
    port = portNum;
  } else {
    host = hostSection;
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