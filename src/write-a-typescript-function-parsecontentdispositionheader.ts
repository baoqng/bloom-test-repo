// bloom-deps:

function parseContentDisposition(header: unknown): { type: string; params: Record<string, string> } {
  if (typeof header !== 'string') {
    throw new TypeError('header must be a string');
  }

  const trimmed = header.trim();
  if (trimmed.length === 0) {
    throw new SyntaxError('Empty Content-Disposition header');
  }

  const firstSemicolon = trimmed.indexOf(';');
  let typeSegment: string;
  let paramString: string;

  if (firstSemicolon === -1) {
    typeSegment = trimmed;
    paramString = '';
  } else {
    typeSegment = trimmed.slice(0, firstSemicolon);
    paramString = trimmed.slice(firstSemicolon + 1);
  }

  const type = typeSegment.trim().toLowerCase();
  if (type.length === 0) {
    throw new SyntaxError('Invalid Content-Disposition type');
  }

  const params: Record<string, string> = {};

  if (paramString.length > 0) {
    const segments = paramString.split(';');

    for (const segment of segments) {
      const trimmedSegment = segment.trim();
      if (trimmedSegment.length === 0) continue;

      const eqIndex = trimmedSegment.indexOf('=');
      let key: string;
      let rawValue: string;

      if (eqIndex === -1) {
        key = trimmedSegment.trim().toLowerCase();
        rawValue = '';
      } else {
        key = trimmedSegment.slice(0, eqIndex).trim().toLowerCase();
        rawValue = trimmedSegment.slice(eqIndex + 1);
      }

      if (key.length === 0) continue;

      let value: string;

      if (key === 'filename*') {
        // RFC 5987: strip charset prefix (everything up to and including the second apostrophe)
        // Format: charset'language'encoded-value
        const firstApos = rawValue.indexOf("'");
        if (firstApos !== -1) {
          const secondApos = rawValue.indexOf("'", firstApos + 1);
          if (secondApos !== -1) {
            const encodedValue = rawValue.slice(secondApos + 1);
            try {
              value = decodeURIComponent(encodedValue);
            } catch {
              value = encodedValue;
            }
          } else {
            value = rawValue.trim();
          }
        } else {
          value = rawValue.trim();
        }
        params['filename*'] = value;
      } else {
        const trimmedValue = rawValue.trim();
        if (trimmedValue.startsWith('"') && trimmedValue.endsWith('"') && trimmedValue.length >= 2) {
          const inner = trimmedValue.slice(1, trimmedValue.length - 1);
          // Unescape: backslash-quote -> quote, two consecutive double quotes -> one double quote
          value = inner.replace(/\\"/g, '"').replace(/""/g, '"');
        } else {
          value = trimmedValue;
        }
        params[key] = value;
      }
    }
  }

  // If both 'filename' and 'filename*' are present, use 'filename*' value for both
  if ('filename*' in params && 'filename' in params) {
    params['filename'] = params['filename*'];
  } else if ('filename*' in params && !('filename' in params)) {
    // filename* exists but filename does not — still store only under filename*
    // (no override needed)
  }

  return { type, params };
}

export { parseContentDisposition };