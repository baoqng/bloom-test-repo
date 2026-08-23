// bloom-deps:

function parseContentDisposition(header: unknown): { type: string; params: Record<string, string> } {
  if (typeof header !== 'string') {
    throw new TypeError('header must be a string');
  }

  const trimmed = header.trim();
  if (trimmed.length === 0) {
    throw new SyntaxError('Empty Content-Disposition header');
  }

  const semicolonIndex = trimmed.indexOf(';');
  let typeSegment: string;
  let paramString: string;

  if (semicolonIndex === -1) {
    typeSegment = trimmed;
    paramString = '';
  } else {
    typeSegment = trimmed.slice(0, semicolonIndex);
    paramString = trimmed.slice(semicolonIndex + 1);
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
        // RFC 5987: strip charset prefix (before and including first apostrophe pair)
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
      } else if (rawValue.startsWith('"')) {
        // Quoted string: strip outer quotes and unescape
        const inner = rawValue.slice(1, rawValue.lastIndexOf('"'));
        value = inner.replace(/\\"/g, '"').replace(/""/g, '"');
      } else {
        value = rawValue.trim();
      }

      params[key] = value;
    }
  }

  // If both 'filename' and 'filename*' are present, use filename* value for both
  if ('filename' in params && 'filename*' in params) {
    const filenameStar = params['filename*'];
    params['filename'] = filenameStar;
    params['filename*'] = filenameStar;
  }

  return { type, params };
}

export { parseContentDisposition };