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
  let rest = url.slice(protocolSepIndex + 3);

  // Parse query string
  const params: Record<string, string> = {};
  const queryIndex = rest.indexOf('?');
  let queryString = '';
  if (queryIndex !== -1) {
    queryString = rest.slice(queryIndex + 1);
    rest = rest.slice(0, queryIndex);
  }

  if (queryString.length > 0) {
    const pairs = queryString.split('&');
    for (const pair of pairs) {
      if (pair.length === 0) continue;
      const eqIndex = pair.indexOf('=');
      if (eqIndex === -1) {
        const key = decodeURIComponent(pair);
        if (key.length > 0) params[key] = '';
      } else {
        const key = decodeURIComponent(pair.slice(0, eqIndex));
        const value = decodeURIComponent(pair.slice(eqIndex + 1));
        if (key.length > 0) params[key] = value;
      }
    }
  }

  // Parse credentials: find last '@' before the host section
  let user: string | null = null;
  let password: string | null = null;

  const lastAtIndex = rest.lastIndexOf('@');
  if (lastAtIndex !== -1) {
    const credentials = rest.slice(0, lastAtIndex);
    rest = rest.slice(lastAtIndex + 1);

    const colonIndex = credentials.indexOf(':');
    if (colonIndex === -1) {
      user = decodeURIComponent(credentials);
      password = null;
    } else {
      user = decodeURIComponent(credentials.slice(0, colonIndex));
      password = decodeURIComponent(credentials.slice(colonIndex + 1));
    }
  }

  // Parse host and database
  const slashIndex = rest.indexOf('/');
  let hostSection: string;
  let databasePath: string;

  if (slashIndex === -1) {
    hostSection = rest;
    databasePath = '';
  } else {
    hostSection = rest.slice(0, slashIndex);
    databasePath = rest.slice(slashIndex + 1);
  }

  // Parse port from host
  let host: string;
  let port: number | null = null;

  const lastColonIndex = hostSection.lastIndexOf(':');
  if (lastColonIndex !== -1) {
    const potentialPort = hostSection.slice(lastColonIndex + 1);
    const potentialHost = hostSection.slice(0, lastColonIndex);
    const portNum = parseInt(potentialPort, 10);
    if (!Number.isInteger(portNum) || portNum < 1 || portNum > 65535) {
      throw new RangeError('Invalid port');
    }
    port = portNum;
    host = potentialHost;
  } else {
    host = hostSection;
  }

  const database = decodeURIComponent(databasePath);

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