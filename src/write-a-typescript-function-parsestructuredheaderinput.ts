// bloom-deps:

function parseStructuredHeader(input: unknown): { value: string; params: Record<string, string | boolean> } {
  if (typeof input !== 'string' || input.length === 0) {
    throw new TypeError('input must be a non-empty string');
  }

  const firstDelim = input.indexOf(';');
  let primaryValue: string;
  let rest: string;

  if (firstDelim === -1) {
    primaryValue = input.trim();
    rest = '';
  } else {
    primaryValue = input.slice(0, firstDelim).trim();
    rest = input.slice(firstDelim + 1);
  }

  const params: Record<string, string | boolean> = {};

  if (rest.length > 0) {
    const segments = rest.split(';');
    for (const segment of segments) {
      const trimmedSegment = segment.trim();
      if (trimmedSegment.length === 0) {
        continue;
      }

      const eqIndex = trimmedSegment.indexOf('=');

      if (eqIndex === -1) {
        // bare key => flag parameter
        const key = trimmedSegment.toLowerCase();
        params[key] = true;
      } else {
        const key = trimmedSegment.slice(0, eqIndex).trim();
        const rawValue = trimmedSegment.slice(eqIndex + 1).trim();

        if (key.length === 0 || rawValue.length === 0) {
          throw new SyntaxError('Malformed parameter');
        }

        const normalizedKey = key.toLowerCase();

        let paramValue: string;
        if (rawValue.startsWith('"') && rawValue.endsWith('"') && rawValue.length >= 2) {
          paramValue = rawValue.slice(1, rawValue.length - 1);
        } else {
          paramValue = rawValue;
        }

        params[normalizedKey] = paramValue;
      }
    }
  }

  return { value: primaryValue, params };
}

export { parseStructuredHeader };