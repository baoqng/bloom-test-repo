// bloom-deps:

export interface ConnectionInfo {
  user: string;
  password: string;
  host: string;
  port: number;
  database: string;
}

export function parseConnectionString(dsn: unknown): ConnectionInfo {
  if (typeof dsn !== 'string') {
    throw new TypeError('dsn must be a string');
  }

  const PROTOCOL = 'postgres://';
  if (!dsn.startsWith(PROTOCOL)) {
    throw new SyntaxError('Connection string must begin with "postgres://"');
  }

  const rest = dsn.slice(PROTOCOL.length);

  // rest should be: user:pass@host:port/dbname
  const atIndex = rest.indexOf('@');
  if (atIndex === -1) {
    throw new SyntaxError('Connection string is missing the "@" separator between credentials and host');
  }

  const credentialsPart = rest.slice(0, atIndex);
  const hostAndRest = rest.slice(atIndex + 1);

  // Parse user and password from credentials
  const colonIndex = credentialsPart.indexOf(':');
  let user: string;
  let password: string;

  if (colonIndex === -1) {
    user = credentialsPart;
    password = '';
  } else {
    user = credentialsPart.slice(0, colonIndex);
    password = credentialsPart.slice(colonIndex + 1);
  }

  // Parse host, port, and database from hostAndRest
  // Format: host:port/dbname
  const slashIndex = hostAndRest.indexOf('/');
  if (slashIndex === -1) {
    throw new SyntaxError('Connection string is missing the database segment');
  }

  const hostPortPart = hostAndRest.slice(0, slashIndex);
  const database = hostAndRest.slice(slashIndex + 1);

  if (!database) {
    throw new SyntaxError('Connection string is missing the database name');
  }

  const hostColonIndex = hostPortPart.lastIndexOf(':');
  if (hostColonIndex === -1) {
    throw new SyntaxError('Connection string is missing the port segment');
  }

  const host = hostPortPart.slice(0, hostColonIndex);
  const portStr = hostPortPart.slice(hostColonIndex + 1);

  if (!host) {
    throw new SyntaxError('Connection string is missing the host segment');
  }

  if (!portStr) {
    throw new SyntaxError('Connection string is missing the port segment');
  }

  const portNum = Number(portStr);

  if (!Number.isFinite(portNum) || !Number.isInteger(portNum)) {
    throw new RangeError(`Port must be an integer between 1 and 65535, got: ${portStr}`);
  }

  if (portNum < 1 || portNum > 65535) {
    throw new RangeError(`Port must be between 1 and 65535 inclusive, got: ${portNum}`);
  }

  return {
    user,
    password,
    host,
    port: portNum,
    database,
  };
}