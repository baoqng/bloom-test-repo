// bloom-deps:

function parseXmlContentType(header: unknown): { mediaType: string; params: Record<string, string> } {
  if (typeof header !== 'string') {
    throw new TypeError('header must be a string');
  }

  if (!header.trim()) {
    throw new RangeError('header must not be empty');
  }

  const trimmed = header.trim();

  // Extract media type: portion before first semicolon
  const firstSemicolon = trimmed.indexOf(';');
  const mediaTypeRaw = firstSemicolon === -1 ? trimmed : trimmed.slice(0, firstSemicolon);
  const mediaType = mediaTypeRaw.trim().toLowerCase();

  // Validate media type: exactly one forward slash with non-empty type and subtype
  const slashIndex = mediaType.indexOf('/');
  const slashCount = mediaType.split('/').length - 1;
  if (slashCount !== 1 || slashIndex === -1) {
    throw new SyntaxError('media type must be in type/subtype format');
  }
  const typePart = mediaType.slice(0, slashIndex);
  const subtypePart = mediaType.slice(slashIndex + 1);
  if (!typePart || !subtypePart) {
    throw new SyntaxError('media type must be in type/subtype format');
  }

  // Parse parameters
  const params: Record<string, string> = {};

  if (firstSemicolon !== -1) {
    const rest = trimmed.slice(firstSemicolon + 1);
    // Split remaining by semicolons
    const segments = rest.split(';');

    for (const segment of segments) {
      const trimmedSegment = segment.trim();

      // Ignore segments without equals sign
      const equalsIndex = trimmedSegment.indexOf('=');
      if (equalsIndex === -1) {
        continue;
      }

      // Extract name and value using exactly-one-delimiter approach
      const name = trimmedSegment.slice(0, equalsIndex).trim().toLowerCase();
      let value = trimmedSegment.slice(equalsIndex + 1).trim();

      // Strip surrounding double-quotes if present
      if (value.startsWith('"') && value.endsWith('"') && value.length >= 2) {
        value = value.slice(1, value.length - 1);
      }

      if (name in params) {
        throw new SyntaxError('duplicate parameter');
      }

      params[name] = value;
    }
  }

  return { mediaType, params };
}

export { parseXmlContentType };