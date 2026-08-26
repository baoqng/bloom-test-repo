// bloom-deps:

export function parseConnectionString(value: unknown): { scheme: string; host: string; port: number; path: string } {
  if (typeof value !== 'string') {
    throw new TypeError('Expected a string');
  }

  const separatorIndex = value.indexOf('://');
  if (separatorIndex === -1) {
    throw new SyntaxError('Missing scheme');
  }

  const scheme = value.slice(0, separatorIndex);
  const rest = value.slice(separatorIndex + 3);

  if (scheme.length === 0 || !/^[a-zA-Z0-9+\-.]+$/.test(scheme)) {
    throw new SyntaxError('Invalid scheme');
  }

  const slashIndex = rest.indexOf('/');
  let authority: string;
  let path: string;

  if (slashIndex === -1) {
    authority = rest;
    path = '';
  } else {
    authority = rest.slice(0, slashIndex);
    path = rest.slice(slashIndex);
  }

  const colonIndex = authority.indexOf(':');
  if (colonIndex === -1) {
    throw new SyntaxError('Missing port');
  }

  const host = authority.slice(0, colonIndex);
  const portStr = authority.slice(colonIndex + 1);

  if (host.length === 0) {
    throw new SyntaxError('Missing host');
  }

  if (!/^\d+$/.test(portStr)) {
    throw new SyntaxError('Invalid port');
  }

  const port = parseInt(portStr, 10);
  if (port < 1 || port > 65535) {
    throw new SyntaxError('Invalid port');
  }

  return {
    scheme: scheme.toLowerCase(),
    host: host.toLowerCase(),
    port,
    path,
  };
}