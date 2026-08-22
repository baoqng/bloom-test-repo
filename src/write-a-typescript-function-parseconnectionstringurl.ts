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
  const questionIdx = rest.indexOf('?');
  let beforeQuery: string;
  let queryString: string;

  if (questionIdx === -1) {
    beforeQuery = rest;
    queryString = '';
  } else {
    beforeQuery = rest.slice(0, questionIdx);
    queryString = rest.slice(questionIdx + 1);
  }

  // Parse params
  const params: Record<string, string> = {};
  if (queryString.length > 0) {
    const pairs = queryString.split('&');
    for (const pair of pairs) {
      if (pair.length === 0) continue;
      const eqIdx = pair.indexOf('=');
      if (eqIdx === -1) {
        const key = decodeURIComponent(pair);
        if (key.length > 0) {
          params[key] = '';
        }
      } else {
        const key = decodeURIComponent(pair.slice(0, eqIdx));
        const value = decodeURIComponent(pair.slice(eqIdx + 1));
        if (key.length > 0) {
          params[key] = value;
        }
      }
    }
  }

  // Determine ssl
  const ssl = params['ssl'] === 'true' || params['sslmode'] === 'require';

  // Find credentials and host/path
  let credentialsPart: string | null = null;
  let hostAndPath: string;

  const lastAtIdx = beforeQuery.lastIndexOf('@');
  if (lastAtIdx !== -1) {
    credentialsPart = beforeQuery.slice(0, lastAtIdx);
    hostAndPath = beforeQuery.slice(lastAtIdx + 1);
  } else {
    hostAndPath = beforeQuery;
  }

  // Parse credentials
  let user: string | null = null;
  let password: string | null = null;

  if (credentialsPart !== null) {
    const colonIdx = credentialsPart.indexOf(':');
    if (colonIdx === -1) {
      user = decodeURIComponent(credentialsPart);
      password = null;
    } else {
      user = decodeURIComponent(credentialsPart.slice(0, colonIdx));
      password = decodeURIComponent(credentialsPart.slice(colonIdx + 1));
    }
  }

  // Parse host and path
  const slashIdx = hostAndPath.indexOf('/');
  let hostSection: string;
  let databasePath: string;

  if (slashIdx === -1) {
    hostSection = hostAndPath;
    databasePath = '';
  } else {
    hostSection = hostAndPath.slice(0, slashIdx);
    databasePath = hostAndPath.slice(slashIdx + 1);
  }

  // Parse host and port
  let host: string;
  let port: number | null = null;

  const lastColonIdx = hostSection.lastIndexOf(':');
  if (lastColonIdx === -1) {
    host = hostSection;
  } else {
    const potentialHost = hostSection.slice(0, lastColonIdx);
    const potentialPort = hostSection.slice(lastColonIdx + 1);

    // Check if there's a port value
    if (potentialPort.length > 0) {
      const portNum = parseInt(potentialPort, 10);
      if (!Number.isInteger(portNum) || portNum < 1 || portNum > 65535 || String(portNum) !== potentialPort) {
        throw new RangeError('Invalid port');
      }
      host = potentialHost;
      port = portNum;
    } else {
      host = potentialHost;
    }
  }

  // Decode database
  const database = decodeURIComponent(databasePath);

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