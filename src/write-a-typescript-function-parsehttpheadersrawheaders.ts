// bloom-deps:

function parseHTTPHeaders(rawHeaders: string): Record<string, string> {
  if (typeof rawHeaders !== 'string') {
    throw new TypeError('Input must be a string');
  }

  const result: Record<string, string> = {};

  // Split on \r\n or \n
  const lines = rawHeaders.split(/\r\n|\n/);

  let firstNonEmptyLine = true;

  for (const line of lines) {
    // Skip empty lines
    if (line.trim() === '') {
      continue;
    }

    // Skip HTTP status line if it's the first non-empty line
    if (firstNonEmptyLine) {
      firstNonEmptyLine = false;
      if (/^HTTP\//.test(line)) {
        continue;
      }
    } else {
      // Check subsequent lines aren't status lines (only first is skipped)
    }

    // Check for colon separator
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) {
      throw new SyntaxError(`Malformed header line: "${line}"`);
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