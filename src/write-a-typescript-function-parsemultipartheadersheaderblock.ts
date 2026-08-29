// bloom-deps:

function parseMultipartHeaders(headerBlock: unknown): Record<string, string> {
  if (typeof headerBlock !== 'string') {
    throw new TypeError('headerBlock must be a string');
  }

  const result: Record<string, string> = {};

  const lines = headerBlock.split(/\r\n|\n/);

  for (const line of lines) {
    if (line === '') {
      continue;
    }

    const delimIndex = line.indexOf(': ');
    if (delimIndex === -1) {
      throw new SyntaxError(`Invalid multipart header line: ${line}`);
    }

    const rawName = line.slice(0, delimIndex);
    const rawValue = line.slice(delimIndex + 2);

    const normalizedName = rawName
      .split('-')
      .map((word) => {
        if (word.length === 0) return word;
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join('-');

    const trimmedValue = rawValue.trim();

    if (Object.prototype.hasOwnProperty.call(result, normalizedName)) {
      result[normalizedName] = result[normalizedName] + ', ' + trimmedValue;
    } else {
      result[normalizedName] = trimmedValue;
    }
  }

  return result;
}

export { parseMultipartHeaders };