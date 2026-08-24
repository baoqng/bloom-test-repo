// bloom-deps:

function parseHTTPHeaders(rawHeaders: string): Record<string, string> {
  if (typeof rawHeaders !== 'string') {
    throw new TypeError('Input must be a string');
  }

  if (rawHeaders.length > 1_000_000) {
    throw new TypeError('Input string exceeds maximum allowed length');
  }

  const result: Record<string, string> = {};

  const lines = rawHeaders.split(/\r\n|\n/);

  let startIndex = 0;

  if (lines.length > 0 && /^HTTP\//.test(lines[0].trim())) {
    startIndex = 1;
  }

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim() === '') {
      continue;
    }

    const colonIndex = line.indexOf(':');

    if (colonIndex === -1) {
      throw new SyntaxError(
        `Invalid header line (no colon separator): "${line}"`
      );
    }

    const name = line.slice(0, colonIndex).trim().toLowerCase();
    const value = line.slice(colonIndex + 1).trim();

    if (name in result) {
      result[name] = result[name] + ', ' + value;
    } else {
      result[name] = value;
    }
  }

  return result;
}

export { parseHTTPHeaders };