// bloom-deps:

export function parseMediaTypeHeader(header: unknown): { type: string; params: Record<string, string> } {
  if (typeof header !== 'string') {
    throw new TypeError('header must be a string');
  }

  if (!header.trim()) {
    throw new RangeError('header must not be empty');
  }

  // Split on the first semicolon only
  const firstSemicolon = header.indexOf(';');
  let mediaTypeRaw: string;
  let paramsPart: string;

  if (firstSemicolon === -1) {
    mediaTypeRaw = header;
    paramsPart = '';
  } else {
    mediaTypeRaw = header.slice(0, firstSemicolon);
    paramsPart = header.slice(firstSemicolon + 1);
  }

  const mediaType = mediaTypeRaw.trim();

  if (!mediaType) {
    throw new RangeError('media type must not be empty');
  }

  // Check for exactly one '/'
  const firstSlash = mediaType.indexOf('/');
  if (firstSlash === -1) {
    throw new RangeError('media type must contain a slash');
  }
  const secondSlash = mediaType.indexOf('/', firstSlash + 1);
  if (secondSlash !== -1) {
    throw new RangeError('media type must contain a slash');
  }

  const normalizedType = mediaType.toLowerCase();

  const params: Record<string, string> = {};

  if (paramsPart) {
    // Split parameters by ';'
    const paramTokens = paramsPart.split(';');

    for (const token of paramTokens) {
      const trimmedToken = token.trim();

      if (!trimmedToken) {
        continue;
      }

      // Split on first '=' only
      const eqIndex = trimmedToken.indexOf('=');
      if (eqIndex === -1) {
        continue;
      }

      const name = trimmedToken.slice(0, eqIndex).trim();
      const value = trimmedToken.slice(eqIndex + 1).trim();

      if (!name || !value) {
        continue;
      }

      const normalizedName = name.toLowerCase();

      // Strip surrounding double quotes
      let normalizedValue = value;
      if (normalizedValue.startsWith('"') && normalizedValue.endsWith('"') && normalizedValue.length >= 2) {
        normalizedValue = normalizedValue.slice(1, normalizedValue.length - 1);
      }

      params[normalizedName] = normalizedValue;
    }
  }

  return { type: normalizedType, params };
}