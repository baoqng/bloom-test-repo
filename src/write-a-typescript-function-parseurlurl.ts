// bloom-deps:

export function parseURL(url: string): {
  protocol: string;
  host: string;
  port: number | null;
  pathname: string;
  search: string;
  hash: string;
  username: string;
  password: string;
} {
  if (typeof url !== 'string') {
    throw new TypeError('Expected a string');
  }

  const schemeDelimiter = '://';
  const schemeIndex = url.indexOf(schemeDelimiter);
  if (schemeIndex === -1) {
    throw new SyntaxError('URL has no protocol (no "://" found)');
  }

  const protocol = url.slice(0, schemeIndex);
  let rest = url.slice(schemeIndex + schemeDelimiter.length);

  // Extract hash
  let hash = '';
  const hashIndex = rest.indexOf('#');
  if (hashIndex !== -1) {
    hash = rest.slice(hashIndex);
    rest = rest.slice(0, hashIndex);
  }

  // Extract search
  let search = '';
  const searchIndex = rest.indexOf('?');
  if (searchIndex !== -1) {
    search = rest.slice(searchIndex);
    rest = rest.slice(0, searchIndex);
  }

  // Extract pathname from authority
  let authority = rest;
  let pathname = '/';
  const pathIndex = rest.indexOf('/');
  if (pathIndex !== -1) {
    pathname = rest.slice(pathIndex);
    authority = rest.slice(0, pathIndex);
  }

  if (pathname === '') {
    pathname = '/';
  }

  // Extract username and password from authority
  let username = '';
  let password = '';
  let hostWithPort = authority;

  const atIndex = authority.lastIndexOf('@');
  if (atIndex !== -1) {
    const userInfo = authority.slice(0, atIndex);
    hostWithPort = authority.slice(atIndex + 1);
    const colonInUserInfo = userInfo.indexOf(':');
    if (colonInUserInfo !== -1) {
      username = userInfo.slice(0, colonInUserInfo);
      password = userInfo.slice(colonInUserInfo + 1);
    } else {
      username = userInfo;
    }
  }

  // Extract host and port
  let host = hostWithPort;
  let port: number | null = null;

  // Handle IPv6 addresses
  if (hostWithPort.startsWith('[')) {
    const closingBracket = hostWithPort.indexOf(']');
    if (closingBracket !== -1) {
      const afterBracket = hostWithPort.slice(closingBracket + 1);
      host = hostWithPort.slice(0, closingBracket + 1);
      if (afterBracket.startsWith(':')) {
        const portStr = afterBracket.slice(1);
        if (portStr.length > 0) {
          const portNum = Number(portStr);
          if (!isNaN(portNum)) {
            port = portNum;
          }
        }
      }
    }
  } else {
    const colonIndex = hostWithPort.lastIndexOf(':');
    if (colonIndex !== -1) {
      const portStr = hostWithPort.slice(colonIndex + 1);
      const possibleHost = hostWithPort.slice(0, colonIndex);
      if (portStr.length > 0 && /^\d+$/.test(portStr)) {
        port = Number(portStr);
        host = possibleHost;
      }
    }
  }

  return {
    protocol,
    host,
    port,
    pathname,
    search,
    hash,
    username,
    password,
  };
}