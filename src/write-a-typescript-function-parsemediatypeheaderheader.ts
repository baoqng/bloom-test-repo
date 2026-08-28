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

  const mediaTypeTrimmed = mediaTypeRaw.trim();

  if (!mediaTypeTrimmed) {
    throw new RangeError('media type must not be empty');
  }

  // Count occurrences of '/' explicitly
  let slashCount = 0;
  let idx = -1;
  let searchFrom = 0;
  while (true) {
    const found = mediaTypeTrimmed.indexOf('/', searchFrom);
    if (found === -1) break;
    slashCount++;
    idx = found;
    searchFrom = found + 1;
  }

  if (slashCount !== 1) {
    throw new RangeError('media type must contain a slash');
  }

  const normalizedType = mediaTypeTrimmed.toLowerCase();

  const params: Record<string, string> = {};

  if (paramsPart) {
    // Split remaining params by ';'
    let remaining = paramsPart;
    let searchStart = 0;

    const tokens: string[] = [];

    while (true) {
      const semi = remaining.indexOf(';', searchStart);
      if (semi === -1) {
        tokens.push(remaining.slice(searchStart));
        break;
      } else {
        tokens.push(remaining.slice(searchStart, semi));
        searchStart = semi + 1;
      }
    }

    for (const token of tokens) {
      const trimmedToken = token.trim();

      // Skip empty tokens
      if (!trimmedToken) {
        continue;
      }

      // Split on first '=' only
      const eqIndex = trimmedToken.indexOf('=');

      if (eqIndex === -1) {
        // No '=' found, skip silently
        continue;
      }

      const paramName = trimmedToken.slice(0, eqIndex).trim();
      const paramValue = trimmedToken.slice(eqIndex + 1).trim();

      if (!paramName || !paramValue) {
        // Either side is empty, skip silently
        continue;
      }

      const normalizedName = paramName.toLowerCase();

      // Strip surrounding double quotes if present
      let finalValue = paramValue;
      if (finalValue.startsWith('"') && finalValue.endsWith('"') && finalValue.length >= 2) {
        finalValue = finalValue.slice(1, finalValue.length - 1);
      }

      params[normalizedName] = finalValue;
    }
  }

  return { type: normalizedType, params };
}