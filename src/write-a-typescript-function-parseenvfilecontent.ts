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

    // Skip comment lines (first non-whitespace char is '#')
    if (line.trimStart().charAt(0) === '#') {
      continue;
    }

    // Must match KEY=VALUE where KEY starts with letter or underscore, followed by alphanumeric/underscore
    const keyPattern = /^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/;
    const match = line.match(keyPattern);

    if (!match) {
      throw new SyntaxError(`Invalid line: ${line}`);
    }

    const key = match[1];
    const rawValue = match[2];

    let value: string;

    if (rawValue.startsWith("'")) {
      // Single-quoted: find closing quote, preserve literally, no escape processing
      const closeIndex = rawValue.indexOf("'", 1);
      if (closeIndex === -1) {
        // No closing quote — treat as unquoted? Spec doesn't say, use literal content after quote
        value = rawValue.slice(1).trim();
      } else {
        value = rawValue.slice(1, closeIndex);
      }
    } else if (rawValue.startsWith('"')) {
      // Double-quoted: process escape sequences
      let closeIndex = -1;
      for (let i = 1; i < rawValue.length; i++) {
        if (rawValue[i] === '"') {
          let backslashCount = 0;
          for (let j = i - 1; j >= 1 && rawValue[j] === '\\'; j--) {
            backslashCount++;
          }
          if (backslashCount % 2 === 0) {
            closeIndex = i;
            break;
          }
        }
      }
      if (closeIndex === -1) {
        // No closing quote — treat remaining as the value
        value = rawValue.slice(1);
      } else {
        const inner = rawValue.slice(1, closeIndex);
        // Process escape sequences: \n as newline, \\ as backslash, \" as double-quote
        // Order matters: process \\ first to avoid double-processing, then \" and \n
        value = inner
          .replace(/\\\\/g, '\x00')
          .replace(/\\"/g, '"')
          .replace(/\\n/g, '\n')
          .replace(/\x00/g, '\\');
      }
    } else {
      // Unquoted: trim leading/trailing whitespace
      value = rawValue.trim();
    }

    result[key] = value;
  }

  return result;
}

export { parseEnvFile };