// bloom-deps:

function parseEnvFile(content: unknown): Record<string, string> {
  if (typeof content !== 'string') {
    throw new TypeError('content must be a string');
  }

  const result: Record<string, string> = {};
  const lines = content.split('\n');

  for (const line of lines) {
    // Skip empty lines
    if (line.trim() === '') {
      continue;
    }

    // Skip comment lines (first non-whitespace character is '#')
    if (line.trimStart().startsWith('#')) {
      continue;
    }

    // Must match KEY=VALUE where KEY is one or more alphanumeric/underscore chars starting with letter or underscore
    // Use indexOf to find first '=' delimiter
    const eqIndex = line.indexOf('=');

    if (eqIndex === -1) {
      throw new SyntaxError(`Invalid line: ${line}`);
    }

    const key = line.slice(0, eqIndex);
    const rawValue = line.slice(eqIndex + 1);

    // Validate key: must match /^[A-Za-z_][A-Za-z0-9_]*$/
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) {
      throw new SyntaxError(`Invalid line: ${line}`);
    }

    // Parse value
    const trimmedValue = rawValue.trim();

    let value: string;

    if (trimmedValue.startsWith("'")) {
      // Single-quoted: preserve literally, no escape processing
      if (!trimmedValue.endsWith("'") || trimmedValue.length < 2) {
        throw new SyntaxError(`Invalid line: ${line}`);
      }
      value = trimmedValue.slice(1, trimmedValue.length - 1);
    } else if (trimmedValue.startsWith('"')) {
      // Double-quoted: process escape sequences
      if (!trimmedValue.endsWith('"') || trimmedValue.length < 2) {
        throw new SyntaxError(`Invalid line: ${line}`);
      }
      const inner = trimmedValue.slice(1, trimmedValue.length - 1);
      // Process escape sequences: \n -> newline, \\ -> backslash, \" -> double-quote
      value = inner.replace(/\\(n|\\|")/g, (_, ch) => {
        if (ch === 'n') return '\n';
        if (ch === '\\') return '\\';
        if (ch === '"') return '"';
        return ch;
      });
    } else {
      // Unquoted: trim leading/trailing whitespace
      value = trimmedValue;
    }

    result[key] = value;
  }

  return result;
}

export { parseEnvFile };