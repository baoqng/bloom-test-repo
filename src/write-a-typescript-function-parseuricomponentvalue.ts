// bloom-deps:

export function parseUriComponent(value: unknown): string {
  if (typeof value !== "string") {
    throw new TypeError("Expected a string");
  }

  if (value === "") {
    throw new SyntaxError("Empty URI component");
  }

  // Check for malformed percent-encoding
  for (let i = 0; i < value.length; i++) {
    if (value[i] === "%") {
      const hex1 = value[i + 1];
      const hex2 = value[i + 2];
      const hexPattern = /^[0-9A-Fa-f]$/;
      if (
        hex1 === undefined ||
        hex2 === undefined ||
        !hexPattern.test(hex1) ||
        !hexPattern.test(hex2)
      ) {
        throw new SyntaxError("Malformed percent-encoding");
      }
    }
  }

  try {
    return decodeURIComponent(value);
  } catch (e) {
    if (e instanceof URIError) {
      throw new SyntaxError("Invalid UTF-8 sequence");
    }
    throw e;
  }
}