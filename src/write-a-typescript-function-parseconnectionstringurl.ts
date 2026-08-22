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

  // Split rest into authority+path and query string
  const queryIndex = rest.indexOf('?');
  const beforeQuery = queryIndex === -1 ? rest : rest.slice(0, queryIndex);
  const queryString = queryIndex === -1 ? '' : rest.slice(queryIndex + 1);

  // Parse params
  const params: Record<string, string> = {};
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

  // ssl detection
  const ssl =
    params['ssl'] === 'true' || params['sslmode'] === 'require';

  // Split beforeQuery into host section and path
  const slashIndex = beforeQuery.indexOf('/');
  const hostSection = slashIndex === -1 ? beforeQuery : beforeQuery.slice(0, slashIndex);
  const pathSection = slashIndex === -1 ? '' : beforeQuery.slice(slashIndex + 1);

  // database
  const database = decodeURIComponent(pathSection);

  // Parse credentials from host section
  let user: string | null = null;
  let password: string | null = null;
  let hostAndPort: string;

  const lastAtIndex = hostSection.lastIndexOf('@');
  if (lastAtIndex !== -1) {
    const credentials = hostSection.slice(0, lastAtIndex);
    hostAndPort = hostSection.slice(lastAtIndex + 1);

    const colonIndex = credentials.indexOf(':');
    if (colonIndex === -1) {
      user = decodeURIComponent(credentials);
      password = null;
    } else {
      user = decodeURIComponent(credentials.slice(0, colonIndex));
      password = decodeURIComponent(credentials.slice(colonIndex + 1));
    }
  } else {
    hostAndPort = hostSection;
  }

  // Parse host and port
  let host: string;
  let port: number | null = null;

  const lastColonIndex = hostAndPort.lastIndexOf(':');
  if (lastColonIndex === -1) {
    host = hostAndPort;
    port = null;
  } else {
    const potentialPort = hostAndPort.slice(lastColonIndex + 1);
    const potentialHost = hostAndPort.slice(0, lastColonIndex);
    const portNum = parseInt(potentialPort, 10);
    if (!Number.isInteger(portNum) || portNum < 1 || portNum > 65535 || String(portNum) !== potentialPort) {
      throw new RangeError('Invalid port');
    }
    host = potentialHost;
    port = portNum;
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