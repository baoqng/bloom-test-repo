// bloom-deps:

function parseConnectionString(url: unknown): {
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

  // Split rest into (authority+path) and query string
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

  // ssl determination
  const ssl =
    params['ssl'] === 'true' || params['sslmode'] === 'require';

  // Find last '@' to split credentials from host
  const lastAtIndex = beforeQuery.lastIndexOf('@');

  let credentialsPart: string | null = null;
  let hostAndPath: string;

  if (lastAtIndex !== -1) {
    credentialsPart = beforeQuery.slice(0, lastAtIndex);
    hostAndPath = beforeQuery.slice(lastAtIndex + 1);
  } else {
    hostAndPath = beforeQuery;
  }

  // Parse user and password
  let user: string | null = null;
  let password: string | null = null;

  if (credentialsPart !== null) {
    const colonIndex = credentialsPart.indexOf(':');
    if (colonIndex === -1) {
      user = decodeURIComponent(credentialsPart);
      password = null;
    } else {
      user = decodeURIComponent(credentialsPart.slice(0, colonIndex));
      password = decodeURIComponent(credentialsPart.slice(colonIndex + 1));
    }
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

  const lastColonIndex = hostSection.lastIndexOf(':');
  if (lastColonIndex !== -1) {
    host = hostSection.slice(0, lastColonIndex);
    const portStr = hostSection.slice(lastColonIndex + 1);
    const portNum = parseInt(portStr, 10);
    if (!Number.isInteger(portNum) || portNum < 1 || portNum > 65535) {
      throw new RangeError('Invalid port');
    }
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

export { parseConnectionString };