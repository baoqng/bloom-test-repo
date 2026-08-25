function validateMimeType(value: unknown): { type: string; subtype: string; parameters: Map<string, string> } {
  if (typeof value !== 'string') {
    throw new TypeError('Expected a string');
  }

  const tokenChars = '[A-Za-z0-9\\-\\.\\+]+';
  const tokenRegex = new RegExp(`^${tokenChars}$`);

  // Split on the first '/'
  const slashIndex = value.indexOf('/');
  if (slashIndex === -1) {
    throw new SyntaxError('Invalid MIME type');
  }

  const rawType = value.slice(0, slashIndex);
  const rest = value.slice(slashIndex + 1);

  if (!rawType || !tokenRegex.test(rawType)) {
    throw new SyntaxError('Invalid MIME type');
  }

  // rest is subtype possibly followed by '; ...'
  // Find where the subtype ends: either end of string or ';'
  let subtypeEnd = rest.indexOf(';');
  let rawSubtype: string;
  let paramsString: string;

  if (subtypeEnd === -1) {
    rawSubtype = rest;
    paramsString = '';
  } else {
    rawSubtype = rest.slice(0, subtypeEnd);
    paramsString = rest.slice(subtypeEnd);
  }

  if (!rawSubtype || !tokenRegex.test(rawSubtype)) {
    throw new SyntaxError('Invalid MIME type');
  }

  const parameters = new Map<string, string>();

  if (paramsString.length > 0) {
    // paramsString is something like "; charset=utf-8; boundary=something"
    // We parse it as a sequence of "; key=value" segments
    let pos = 0;
    const len = paramsString.length;

    while (pos < len) {
      // Expect '; ' at current position
      if (paramsString[pos] !== ';') {
        throw new SyntaxError('Invalid MIME type');
      }
      pos++; // skip ';'

      // Skip spaces after ';'
      while (pos < len && paramsString[pos] === ' ') {
        pos++;
      }

      if (pos >= len) {
        // Trailing semicolon with no parameter
        throw new SyntaxError('Invalid MIME type');
      }

      // Read key
      const eqIndex = paramsString.indexOf('=', pos);
      if (eqIndex === -1) {
        throw new SyntaxError('Invalid MIME type');
      }

      const key = paramsString.slice(pos, eqIndex);
      if (!key || !tokenRegex.test(key)) {
        throw new SyntaxError('Invalid MIME type');
      }

      const lowerKey = key.toLowerCase();

      if (parameters.has(lowerKey)) {
        throw new SyntaxError('Duplicate parameter');
      }

      pos = eqIndex + 1;

      if (pos >= len) {
        throw new SyntaxError('Invalid MIME type');
      }

      let paramValue: string;

      if (paramsString[pos] === '"') {
        // Quoted string
        pos++; // skip opening quote
        let qValue = '';
        let closed = false;
        while (pos < len) {
          const ch = paramsString[pos];
          if (ch === '\\') {
            pos++;
            if (pos >= len) {
              throw new SyntaxError('Invalid MIME type');
            }
            qValue += paramsString[pos];
            pos++;
          } else if (ch === '"') {
            pos++; // skip closing quote
            closed = true;
            break;
          } else {
            qValue += ch;
            pos++;
          }
        }
        if (!closed) {
          throw new SyntaxError('Invalid MIME type');
        }
        paramValue = qValue;
      } else {
        // Token value: read until ';' or end
        const nextSemi = paramsString.indexOf(';', pos);
        if (nextSemi === -1) {
          paramValue = paramsString.slice(pos);
          pos = len;
        } else {
          paramValue = paramsString.slice(pos, nextSemi);
          pos = nextSemi;
        }
        if (!paramValue || !tokenRegex.test(paramValue)) {
          throw new SyntaxError('Invalid MIME type');
        }
      }

      parameters.set(lowerKey, paramValue);
    }
  }

  return {
    type: rawType.toLowerCase(),
    subtype: rawSubtype.toLowerCase(),
    parameters,
  };
}

export { validateMimeType };