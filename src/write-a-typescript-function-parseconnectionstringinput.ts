// bloom-deps:

function decodePercent(str: string): string {
  try {
    return decodeURIComponent(str);
  } catch {
    return str;
  }
}

export function parseConnectionString(input: unknown): {
  protocol: string;
  username: string | null;
  password: string | null;
  host: string;
  port: number | null;
  database: string | null;
  params: Record<string, string>;
} {
  if (typeof input !== 'string' || input.length === 0) {
    throw new TypeError('input must be a non-empty string');
  }

  // Check for '://' using indexOf
  const schemeIdx = input.indexOf('://');
  if (schemeIdx === -1) {
    throw new SyntaxError('Not a valid connection string');
  }

  const protocol = input.slice(0, schemeIdx);
  const rest = input.slice(schemeIdx + 3);

  // Separate query string using indexOf
  let mainPart: string;
  let queryString: string | null = null;

  const queryIdx = rest.indexOf('?');
  if (queryIdx !== -1) {
    mainPart = rest.slice(0, queryIdx);
    queryString = rest.slice(queryIdx + 1);
  } else {
    mainPart = rest;
  }

  // Separate authority+host from database path using indexOf
  let authorityAndHost: string;
  let database: string | null = null;

  const slashIdx = mainPart.indexOf('/');
  if (slashIdx !== -1) {
    authorityAndHost = mainPart.slice(0, slashIdx);
    const dbPart = mainPart.slice(slashIdx + 1);
    database = dbPart.length > 0 ? decodePercent(dbPart) : null;
  } else {
    authorityAndHost = mainPart;
  }

  // Separate userinfo from host using indexOf('@')
  let userinfo: string | null = null;
  let hostAndPort: string;

  const atIdx = authorityAndHost.indexOf('@');
  if (atIdx !== -1) {
    userinfo = authorityAndHost.slice(0, atIdx);
    hostAndPort = authorityAndHost.slice(atIdx + 1);
  } else {
    hostAndPort = authorityAndHost;
  }

  // Parse username and password from userinfo
  let username: string | null = null;
  let password: string | null = null;

  if (userinfo !== null) {
    const colonIdx = userinfo.indexOf(':');
    if (colonIdx !== -1) {
      const rawUser = userinfo.slice(0, colonIdx);
      const rawPass = userinfo.slice(colonIdx + 1);
      username = rawUser.length > 0 ? decodePercent(rawUser) : null;
      password = rawPass.length > 0 ? decodePercent(rawPass) : null;
    } else {
      username = userinfo.length > 0 ? decodePercent(userinfo) : null;
    }
  }

  // Parse host and port from hostAndPort
  let host: string;
  let port: number | null = null;

  const portColonIdx = hostAndPort.lastIndexOf(':');
  if (portColonIdx !== -1) {
    const potentialHost = hostAndPort.slice(0, portColonIdx);
    const potentialPort = hostAndPort.slice(portColonIdx + 1);

    // Check if potentialPort is numeric (including negative sign)
    if (/^-?\d+$/.test(potentialPort)) {
      host = potentialHost;
      const portNum = parseInt(potentialPort, 10);
      if (portNum < 1 || portNum > 65535) {
        throw new RangeError('Port must be between 1 and 65535');
      }
      port = portNum;
    } else {
      host = hostAndPort;
    }
  } else {
    host = hostAndPort;
  }

  if (host.length === 0) {
    throw new SyntaxError('Not a valid connection string');
  }

  // Parse query params
  const params: Record<string, string> = {};
  if (queryString !== null && queryString.length > 0) {
    const pairs = queryString.split('&');
    for (const pair of pairs) {
      if (pair.length === 0) continue;
      const eqIdx = pair.indexOf('=');
      if (eqIdx !== -1) {
        const key = decodePercent(pair.slice(0, eqIdx));
        const value = decodePercent(pair.slice(eqIdx + 1));
        params[key] = value;
      } else {
        const key = decodePercent(pair);
        params[key] = '';
      }
    }
  }

  return {
    protocol,
    username,
    password,
    host,
    port,
    database,
    params,
  };
}