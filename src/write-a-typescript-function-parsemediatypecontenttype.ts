// bloom-deps:

export function parseMediaType(contentType: unknown): {
  type: string;
  subtype: string;
  parameters: Record<string, string>;
} {
  // Validate that contentType is a string
  if (typeof contentType !== "string") {
    throw new TypeError("contentType must be a string");
  }

  // Trim the string and check if it's empty or whitespace-only
  const trimmed = contentType.trim();
  if (trimmed.length === 0) {
    throw new RangeError("contentType must not be empty");
  }

  // Split at the first semicolon
  const semiIndex = trimmed.indexOf(";");
  const mediaTypePortion =
    semiIndex === -1 ? trimmed : trimmed.slice(0, semiIndex).trim();
  const parameterPortion =
    semiIndex === -1 ? "" : trimmed.slice(semiIndex + 1);

  // Validate media-type format: must contain exactly one '/'
  const slashCount = (mediaTypePortion.match(/\//g) || []).length;
  if (slashCount !== 1) {
    throw new RangeError("invalid media type format");
  }

  // Split media-type at '/'
  const slashIndex = mediaTypePortion.indexOf("/");
  const typeRaw = mediaTypePortion.slice(0, slashIndex).trim();
  const subtypeRaw = mediaTypePortion.slice(slashIndex + 1).trim();

  // Validate type is not empty
  if (typeRaw.length === 0) {
    throw new RangeError("type must not be empty");
  }

  // Validate subtype is not empty
  if (subtypeRaw.length === 0) {
    throw new RangeError("subtype must not be empty");
  }

  // Normalize type and subtype to lowercase
  const type = typeRaw.toLowerCase();
  const subtype = subtypeRaw.toLowerCase();

  // Parse parameters
  const parameters: Record<string, string> = {};

  if (parameterPortion.length > 0) {
    const tokens = parameterPortion.split(";");

    for (const token of tokens) {
      const trimmedToken = token.trim();

      // Skip empty tokens
      if (trimmedToken.length === 0) {
        continue;
      }

      // Check for '=' in the token
      const eqIndex = trimmedToken.indexOf("=");
      if (eqIndex === -1) {
        throw new RangeError(`invalid parameter: ${trimmedToken}`);
      }

      // Extract key and value
      const keyRaw = trimmedToken.slice(0, eqIndex).trim();
      const valueRaw = trimmedToken.slice(eqIndex + 1).trim();

      // Lowercase the key
      const key = keyRaw.toLowerCase();

      // Strip surrounding double-quotes from value if present
      let value = valueRaw;
      if (value.length >= 2 && value[0] === '"' && value[value.length - 1] === '"') {
        value = value.slice(1, -1);
      }

      parameters[key] = value;
    }
  }

  return { type, subtype, parameters };
}