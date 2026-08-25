// bloom-deps:

function parseCacheControlHeader(value: unknown): Map<string, string | true> {
  if (typeof value !== 'string') {
    throw new TypeError('Expected a string');
  }

  if (value === '') {
    return new Map<string, string | true>();
  }

  const result = new Map<string, string | true>();
  const directives = value.split(',');

  // Valid token characters per RFC 7230: any VCHAR except delimiters
  // Token chars: !#$%&'*+-.0-9A-Z^_`a-z|~
  const tokenRegex = /^[a-zA-Z0-9!#$%&'*+\-.^_`|~]+$/;

  for (const rawDirective of directives) {
    const directive = rawDirective.trim();

    if (directive === '') {
      throw new SyntaxError('Invalid Cache-Control directive');
    }

    const eqIndex = directive.indexOf('=');

    if (eqIndex === -1) {
      // Bare token (flag)
      if (!tokenRegex.test(directive)) {
        throw new SyntaxError('Invalid Cache-Control directive');
      }
      const token = directive.toLowerCase();
      if (!result.has(token)) {
        result.set(token, true);
      }
    } else {
      // token=value pair
      const token = directive.slice(0, eqIndex);
      const rawValue = directive.slice(eqIndex + 1);

      if (!tokenRegex.test(token)) {
        throw new SyntaxError('Invalid Cache-Control directive');
      }

      let parsedValue: string;

      if (rawValue.startsWith('"') && rawValue.endsWith('"') && rawValue.length >= 2) {
        // Quoted string — strip the quotes
        parsedValue = rawValue.slice(1, -1);
      } else {
        // Unquoted token value
        if (!tokenRegex.test(rawValue)) {
          throw new SyntaxError('Invalid Cache-Control directive');
        }
        parsedValue = rawValue;
      }

      const normalizedToken = token.toLowerCase();
      if (!result.has(normalizedToken)) {
        result.set(normalizedToken, parsedValue);
      }
    }
  }

  return result;
}

export { parseCacheControlHeader };