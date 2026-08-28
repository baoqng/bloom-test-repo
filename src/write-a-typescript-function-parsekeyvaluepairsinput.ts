// bloom-deps:

function parseKeyValuePairs(input: unknown): Record<string, string> {
  if (typeof input !== 'string') {
    throw new TypeError('Input must be a string');
  }

  if (input === '') {
    return {};
  }

  const result: Record<string, string> = {};
  const segments = input.split('&');

  for (const segment of segments) {
    if (segment === '') {
      continue;
    }

    const eqIndex = segment.indexOf('=');

    if (eqIndex === -1) {
      throw new SyntaxError(`Invalid pair: missing '=' in segment '${segment}'`);
    }

    const key = segment.slice(0, eqIndex);
    const value = segment.slice(eqIndex + 1);

    if (key === '') {
      throw new SyntaxError(`Invalid pair: empty key in segment '${segment}'`);
    }

    if (value === '') {
      throw new SyntaxError(`Invalid pair: empty value in segment '${segment}'`);
    }

    result[key] = value;
  }

  return result;
}

export { parseKeyValuePairs };