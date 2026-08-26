// bloom-deps:

function validateMimeType(value: unknown): { type: string; subtype: string; parameters: Map<string, string> } {
  if (typeof value !== "string") {
    throw new TypeError("Expected a string");
  }

  const tokenChars = /^[A-Za-z0-9\-\.+]+$/;

  // Split on the first '/'
  const slashIndex = value.indexOf("/");
  if (slashIndex === -1) {
    throw new SyntaxError("Invalid MIME type");
  }

  const rawType = value.slice(0, slashIndex);
  const rest = value.slice(slashIndex + 1);

  if (rawType.length === 0 || !tokenChars.test(rawType)) {
    throw new SyntaxError("Invalid MIME type");
  }

  // Split the rest into subtype and parameters portion
  // Parameters start after the first '; '
  let rawSubtype: string;
  let paramString: string | null = null;

  const semiIndex = rest.indexOf(";");
  if (semiIndex === -1) {
    rawSubtype = rest;
  } else {
    rawSubtype = rest.slice(0, semiIndex);
    paramString = rest.slice(semiIndex + 1);
  }

  if (rawSubtype.length === 0 || !tokenChars.test(rawSubtype)) {
    throw new SyntaxError("Invalid MIME type");
  }

  const parameters = new Map<string, string>();

  if (paramString !== null) {
    // Parse parameters: '; ' separated key=value pairs
    // The paramString starts after the first ';'
    // Each parameter is preceded by '; ' so paramString should start with ' '
    const paramParts = paramString.split(";");

    for (const part of paramParts) {
      // Each part should be ' key=value'
      if (!part.startsWith(" ")) {
        throw new SyntaxError("Invalid MIME type");
      }

      const paramContent = part.slice(1); // Remove leading space
      const eqIndex = paramContent.indexOf("=");
      if (eqIndex === -1) {
        throw new SyntaxError("Invalid MIME type");
      }

      const paramKey = paramContent.slice(0, eqIndex).toLowerCase();
      const paramValue = paramContent.slice(eqIndex + 1);

      if (paramKey.length === 0 || !tokenChars.test(paramKey)) {
        throw new SyntaxError("Invalid MIME type");
      }

      let resolvedValue: string;

      if (paramValue.startsWith('"')) {
        // Quoted string
        if (!paramValue.endsWith('"') || paramValue.length < 2) {
          throw new SyntaxError("Invalid MIME type");
        }
        // Extract content between quotes
        resolvedValue = paramValue.slice(1, paramValue.length - 1);
        // Basic validation: no unescaped quotes inside (simple check)
        // Allow escaped characters
        if (/(?<!\\)"/.test(resolvedValue)) {
          throw new SyntaxError("Invalid MIME type");
        }
        // Unescape escaped characters
        resolvedValue = resolvedValue.replace(/\\(.)/g, "$1");
      } else {
        // Token value
        if (paramValue.length === 0 || !tokenChars.test(paramValue)) {
          throw new SyntaxError("Invalid MIME type");
        }
        resolvedValue = paramValue;
      }

      if (parameters.has(paramKey)) {
        throw new SyntaxError("Duplicate parameter");
      }

      parameters.set(paramKey, resolvedValue);
    }
  }

  return {
    type: rawType.toLowerCase(),
    subtype: rawSubtype.toLowerCase(),
    parameters,
  };
}

export { validateMimeType };