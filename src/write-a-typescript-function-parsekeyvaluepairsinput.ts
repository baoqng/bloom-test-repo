// bloom-deps:

function parseKeyValuePairs(input: unknown): Record<string, string> {
  if (typeof input !== 'string') {
    throw new TypeError(`Expected a string, got ${typeof input}`);
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

    const equalsIndex = segment.indexOf('=');
    if (equalsIndex === -1) {
      throw new SyntaxError(`Invalid pair: missing '=' in segment '${segment}'`);
    }

    const key = segment.substring(0, equalsIndex);
    const value = segment.substring(equalsIndex + 1);

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