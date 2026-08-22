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

  // Determine ssl
  const ssl =
    params['ssl'] === 'true' || params['sslmode'] === 'require';

  // Split credentials from host+database
  let user: string | null = null;
  let password: string | null = null;
  let hostAndDb = mainPart;

  const lastAtIndex = mainPart.lastIndexOf('@');
  if (lastAtIndex !== -1) {
    const credentialsPart = mainPart.slice(0, lastAtIndex);
    hostAndDb = mainPart.slice(lastAtIndex + 1);

    const colonIndex = credentialsPart.indexOf(':');
    if (colonIndex === -1) {
      user = decodeURIComponent(credentialsPart);
      password = null;
    } else {
      user = decodeURIComponent(credentialsPart.slice(0, colonIndex));
      const rawPassword = credentialsPart.slice(colonIndex + 1);
      password = rawPassword.length > 0 ? decodeURIComponent(rawPassword) : null;
    }
  }

  // Split host from database path
  let hostSection = hostAndDb;
  let databaseRaw = '';

  const slashIndex = hostAndDb.indexOf('/');
  if (slashIndex !== -1) {
    hostSection = hostAndDb.slice(0, slashIndex);
    databaseRaw = hostAndDb.slice(slashIndex + 1);
  }

  // Parse port from host
  let host = hostSection;
  let port: number | null = null;

  const lastColonIndex = hostSection.lastIndexOf(':');
  if (lastColonIndex !== -1) {
    const potentialPort = hostSection.slice(lastColonIndex + 1);
    const portNum = parseInt(potentialPort, 10);
    if (
      !Number.isInteger(portNum) ||
      portNum < 1 ||
      portNum > 65535 ||
      String(portNum) !== potentialPort
    ) {
      throw new RangeError('Invalid port');
    }
    host = hostSection.slice(0, lastColonIndex);
    port = portNum;
  }

  const database = decodeURIComponent(databaseRaw);

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