// bloom-deps:

function decodePercent(str: string): string {
  return decodeURIComponent(str.replace(/\+/g, '%2B'));
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

  // Check for '://'
  const schemeDelimiter = '://';
  const schemeIdx = input.indexOf(schemeDelimiter);
  if (schemeIdx === -1) {
    throw new SyntaxError('Not a valid connection string');
  }

  const protocol = input.slice(0, schemeIdx);
  const rest = input.slice(schemeIdx + schemeDelimiter.length);

  // Split on '?' to separate authority+path from query
  const queryDelimIdx = rest.indexOf('?');
  let authorityAndPath: string;
  let queryString: string | null = null;

  if (queryDelimIdx !== -1) {
    authorityAndPath = rest.slice(0, queryDelimIdx);
    queryString = rest.slice(queryDelimIdx + 1);
  } else {
    authorityAndPath = rest;
  }

  // Split authority+path on '/' to get authority and database path
  const firstSlashIdx = authorityAndPath.indexOf('/');
  let authority: string;
  let databaseRaw: string | null = null;

  if (firstSlashIdx !== -1) {
    authority = authorityAndPath.slice(0, firstSlashIdx);
    const dbPart = authorityAndPath.slice(firstSlashIdx + 1);
    databaseRaw = dbPart.length > 0 ? dbPart : null;
  } else {
    authority = authorityAndPath;
  }

  // Split authority on '@' to get userinfo and hostinfo
  let username: string | null = null;
  let password: string | null = null;
  let hostinfo: string;

  const atIdx = authority.indexOf('@');
  if (atIdx !== -1) {
    const userinfo = authority.slice(0, atIdx);
    hostinfo = authority.slice(atIdx + 1);

    // Split userinfo on ':' for username:password
    const colonIdx = userinfo.indexOf(':');
    if (colonIdx !== -1) {
      const rawUser = userinfo.slice(0, colonIdx);
      const rawPass = userinfo.slice(colonIdx + 1);
      username = rawUser.length > 0 ? decodePercent(rawUser) : null;
      password = rawPass.length > 0 ? decodePercent(rawPass) : null;
    } else {
      username = userinfo.length > 0 ? decodePercent(userinfo) : null;
    }
  } else {
    hostinfo = authority;
  }

  // Split hostinfo on ':' to get host and port
  const hostColonIdx = hostinfo.indexOf(':');
  let host: string;
  let port: number | null = null;

  if (hostColonIdx !== -1) {
    host = hostinfo.slice(0, hostColonIdx);
    const portStr = hostinfo.slice(hostColonIdx + 1);
    if (portStr.length > 0) {
      const portNum = Number(portStr);
      if (!Number.isInteger(portNum) || portNum < 1 || portNum > 65535) {
        throw new RangeError('Port must be between 1 and 65535');
      }
      port = portNum;
    }
  } else {
    host = hostinfo;
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

  const database = databaseRaw !== null ? decodePercent(databaseRaw) : null;

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