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
        // RFC 5987: charset'language'value
        // Strip charset prefix (part before and including first apostrophe pair)
        const firstApos = rawValue.indexOf("'");
        if (firstApos !== -1) {
          const secondApos = rawValue.indexOf("'", firstApos + 1);
          if (secondApos !== -1) {
            const encoded = rawValue.slice(secondApos + 1);
            try {
              value = decodeURIComponent(encoded);
            } catch {
              value = encoded;
            }
          } else {
            // Only one apostrophe, take as-is
            value = rawValue.trim();
          }
        } else {
          // No apostrophe, treat as regular value
          if (rawValue.startsWith('"') && rawValue.endsWith('"') && rawValue.length >= 2) {
            value = unquoteValue(rawValue);
          } else {
            value = rawValue.trim();
          }
        }
      } else {
        const trimmedValue = rawValue.trim();
        if (trimmedValue.startsWith('"') && trimmedValue.endsWith('"') && trimmedValue.length >= 2) {
          value = unquoteValue(trimmedValue);
        } else {
          value = trimmedValue;
        }
      }

      params[key] = value;
    }
  }

  // If both 'filename' and 'filename*' are present, use filename* value for both
  if ('filename' in params && 'filename*' in params) {
    params['filename'] = params['filename*'];
  }

  return { type, params };
}

function unquoteValue(quoted: string): string {
  // Strip outer quotes
  const inner = quoted.slice(1, quoted.length - 1);
  // Unescape: backslash-quote -> quote, two consecutive double quotes -> one double quote
  let result = '';
  let i = 0;
  while (i < inner.length) {
    const ch = inner[i];
    if (ch === '\\' && i + 1 < inner.length && inner[i + 1] === '"') {
      result += '"';
      i += 2;
    } else if (ch === '"' && i + 1 < inner.length && inner[i + 1] === '"') {
      result += '"';
      i += 2;
    } else {
      result += ch;
      i++;
    }
  }
  return result;
}

export { parseContentDisposition };