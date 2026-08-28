// bloom-deps:

export function parseMediaType(input: unknown): { type: string; subtype: string; parameters: Record<string, string> } {
  // Validate input type and non-empty
  if (typeof input !== 'string' || input.length === 0) {
    throw new TypeError('input must be a non-empty string');
  }

  // Find the first slash separator
  const slashIndex = input.indexOf('/');
  if (slashIndex === -1) {
    throw new SyntaxError('Not a valid media type');
  }

  // Extract type component
  const type = input.slice(0, slashIndex).trim().toLowerCase();
  if (type.length === 0) {
    throw new SyntaxError('Not a valid media type');
  }

  // Find the first semicolon (parameter separator)
  const semicolonIndex = input.indexOf(';');
  let subtypeEnd: number;
  if (semicolonIndex === -1) {
    subtypeEnd = input.length;
  } else {
    subtypeEnd = semicolonIndex;
  }

  // Extract subtype component
  const subtype = input.slice(slashIndex + 1, subtypeEnd).trim().toLowerCase();
  if (subtype.length === 0) {
    throw new SyntaxError('Not a valid media type');
  }

  // Parse parameters
  const parameters: Record<string, string> = {};

  if (semicolonIndex !== -1) {
    let paramString = input.slice(semicolonIndex + 1);

    while (paramString.length > 0) {
      // Skip leading whitespace
      paramString = paramString.trimStart();

      if (paramString.length === 0) {
        break;
      }

      // Find the next semicolon
      const nextSemicolon = paramString.indexOf(';');
      let paramPair: string;
      if (nextSemicolon === -1) {
        paramPair = paramString;
        paramString = '';
      } else {
        paramPair = paramString.slice(0, nextSemicolon);
        paramString = paramString.slice(nextSemicolon + 1);
      }

      paramPair = paramPair.trim();
      if (paramPair.length === 0) {
        continue;
      }

      // Find the equals sign
      const equalsIndex = paramPair.indexOf('=');
      if (equalsIndex === -1) {
        continue;
      }

      // Extract key and value
      const key = paramPair.slice(0, equalsIndex).trim().toLowerCase();
      if (key.length === 0) {
        continue;
      }

      let value = paramPair.slice(equalsIndex + 1).trim();

      // Handle quoted values
      if (value.length > 0 && value[0] === '"') {
        // Remove opening quote
        value = value.slice(1);

        // Find closing quote, handling escapes
        let unquotedValue = '';
        let i = 0;
        let foundClosingQuote = false;

        while (i < value.length) {
          if (value[i] === '\\' && i + 1 < value.length) {
            // Backslash escape sequence
            unquotedValue += value[i + 1];
            i += 2;
          } else if (value[i] === '"') {
            // Found closing quote
            foundClosingQuote = true;
            break;
          } else {
            unquotedValue += value[i];
            i++;
          }
        }

        if (foundClosingQuote) {
          value = unquotedValue;
        }
      }

      parameters[key] = value;
    }
  }

  return {
    type,
    subtype,
    parameters,
  };
}