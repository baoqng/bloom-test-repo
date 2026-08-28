// bloom-deps:

function parseIpAndPort(input: unknown): { host: string; port: number } {
  if (typeof input !== 'string') {
    throw new TypeError('input must be a string');
  }

  const trimmed = input.trim();

  if (trimmed.length === 0) {
    throw new RangeError('input must not be empty');
  }

  let host: string;
  let portString: string;

  if (trimmed.startsWith('[')) {
    const closingBracketIndex = trimmed.indexOf(']');
    if (closingBracketIndex === -1) {
      throw new RangeError('missing closing bracket');
    }

    host = trimmed.slice(1, closingBracketIndex);

    if (closingBracketIndex + 1 >= trimmed.length || trimmed[closingBracketIndex + 1] !== ':') {
      throw new RangeError('missing colon after bracket');
    }

    portString = trimmed.slice(closingBracketIndex + 2);
  } else {
    const colonIndex = trimmed.lastIndexOf(':');
    if (colonIndex === -1) {
      throw new RangeError('missing port separator');
    }

    host = trimmed.slice(0, colonIndex);
    portString = trimmed.slice(colonIndex + 1);
  }

  if (host.length === 0) {
    throw new RangeError('host must not be empty');
  }

  if (portString.length === 0 || !/^\d+$/.test(portString)) {
    throw new RangeError('port must be a valid integer');
  }

  const port = parseInt(portString, 10);

  if (port < 1 || port > 65535) {
    throw new RangeError('port must be between 1 and 65535');
  }

  return { host, port };
}

export { parseIpAndPort };