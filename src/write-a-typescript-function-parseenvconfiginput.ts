// bloom-deps:

function parseEnvConfig(input: unknown): Record<string, string> {
  if (typeof input !== 'string') {
    throw new TypeError('Input must be a string');
  }

  const lines = input.split('\n');
  const result: Record<string, string> = {};

  for (let i = 0; i < lines.length; i++) {
    const lineNumber = i + 1;
    const line = lines[i];

    // Skip blank lines (empty or whitespace-only)
    if (line.trim() === '') {
      continue;
    }

    // Skip comment lines (first non-whitespace character is '#')
    const trimmedLine = line.trimStart();
    if (trimmedLine.startsWith('#')) {
      continue;
    }

    // Check for '=' separator
    if (!line.includes('=')) {
      throw new SyntaxError(`Line ${lineNumber}: missing '=' separator`);
    }

    // Extract key and value using indexOf to find first '='
    const eqIndex = line.indexOf('=');
    const rawKey = line.slice(0, eqIndex);
    const rawValue = line.slice(eqIndex + 1);

    const key = rawKey.trim();
    const value = rawValue.trim();

    // Check for empty key
    if (key === '') {
      throw new SyntaxError(`Line ${lineNumber}: key must be non-empty`);
    }

    // Check key format
    if (!/^[A-Z][A-Z0-9_]*$/.test(key)) {
      throw new SyntaxError(`Line ${lineNumber}: key must match [A-Z][A-Z0-9_]*`);
    }

    result[key] = value;
  }

  return result;
}

export { parseEnvConfig };