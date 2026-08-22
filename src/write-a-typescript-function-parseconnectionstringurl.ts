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

  const protocolSeparatorIndex = url.indexOf('://');
  const protocol = url.slice(0, protocolSeparatorIndex);
  const rest = url.slice(protocolSeparatorIndex + 3);

  // Split query string
  const questionMarkIndex = rest.indexOf('?');
  let beforeQuery: string;
  let queryString: string;

  if (questionMarkIndex !== -1) {
    beforeQuery = rest.slice(0, questionMarkIndex);
    queryString = rest.slice(questionMarkIndex + 1);
  } else {
    beforeQuery = rest;
    queryString = '';
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

  // Separate credentials from host/path
  let user: string | null = null;
  let password: string | null = null;
  let hostAndPath: string;

  const lastAtIndex = beforeQuery.lastIndexOf('@');
  if (lastAtIndex !== -1) {
    const credentialsPart = beforeQuery.slice(0, lastAtIndex);
    hostAndPath = beforeQuery.slice(lastAtIndex + 1);

    const colonIndex = credentialsPart.indexOf(':');
    if (colonIndex === -1) {
      user = decodeURIComponent(credentialsPart);
      password = null;
    } else {
      user = decodeURIComponent(credentialsPart.slice(0, colonIndex));
      password = decodeURIComponent(credentialsPart.slice(colonIndex + 1));
    }
  } else {
    hostAndPath = beforeQuery;
  }

  // Split host and path
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
    const potentialHost = hostSection.slice(0, lastColonIndex);
    const potentialPort = hostSection.slice(lastColonIndex + 1);
    const parsedPort = parseInt(potentialPort, 10);
    if (
      !Number.isInteger(parsedPort) ||
      isNaN(parsedPort) ||
      parsedPort < 1 ||
      parsedPort > 65535 ||
      String(parsedPort) !== potentialPort
    ) {
      throw new RangeError('Invalid port');
    }
    host = potentialHost;
    port = parsedPort;
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