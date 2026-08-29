// bloom-deps:

function parseNameValueBlock(input: unknown): Record<string, string> {
  if (typeof input !== 'string') {
    throw new TypeError('input must be a string');
  }

  const result: Record<string, string> = {};
  const lines = input.split('\n');

  let lastKey: string | null = null;
  let hasProcessedAnyEntry = false;

  for (const line of lines) {
    // Skip blank lines
    if (line.trim() === '') {
      continue;
    }

    // Check if it's a folded line (starts with whitespace)
    if (line.length > 0 && (line[0] === ' ' || line[0] === '\t')) {
      if (lastKey === null) {
        throw new SyntaxError('Folded line with no preceding name');
      }
      // Append to previous value with single space replacing leading whitespace
      result[lastKey] = result[lastKey] + ' ' + line.trim();
      hasProcessedAnyEntry = true;
      continue;
    }

    // Find the first ': ' delimiter
    const delimIndex = line.indexOf(': ');
    if (delimIndex === -1) {
      throw new SyntaxError(`Invalid header line: ${line}`);
    }

    const name = line.slice(0, delimIndex).toLowerCase();
    const value = line.slice(delimIndex + 2);

    result[name] = value;
    lastKey = name;
    hasProcessedAnyEntry = true;
  }

  return result;
}

export { parseNameValueBlock };