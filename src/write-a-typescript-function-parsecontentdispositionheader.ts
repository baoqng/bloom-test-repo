// bloom-deps:

export function parseContentDisposition(header: unknown): { type: string; params: Record<string, string> } {
  if (typeof header !== 'string') {
    throw new TypeError('header must be a string');
  }

  const trimmed = header.trim();
  if (trimmed.length === 0) {
    throw new SyntaxError('Empty Content-Disposition header');
  }

  const semicolonIndex = trimmed.indexOf(';');
  let typeStr: string;
  let paramStr: string;

  if (semicolonIndex === -1) {
    typeStr = trimmed;
    paramStr = '';
  } else {
    typeStr = trimmed.slice(0, semicolonIndex);
    paramStr = trimmed.slice(semicolonIndex + 1);
  }

  const type = typeStr.trim().toLowerCase();
  if (type.length === 0) {
    throw new SyntaxError('Invalid Content-Disposition type');
  }

  const params: Record<string, string> = {};

  if (paramStr.length > 0) {
    const segments = paramStr.split(';');

    for (const segment of segments) {
      const seg = segment.trim();
      if (seg.length === 0) continue;

      const eqIndex = seg.indexOf('=');
      if (eqIndex === -1) {
        // No '=' found; treat as key with empty value or skip
        const key = seg.toLowerCase().trim();
        if (key.length === 0) continue;
        params[key] = '';
        continue;
      }

      const key = seg.slice(0, eqIndex).toLowerCase().trim();
      if (key.length === 0) continue;

      const rawValue = seg.slice(eqIndex + 1);

      let value: string;

      if (key === 'filename*') {
        // RFC 5987: charset'language'value
        // Strip charset prefix (everything up to and including the second apostrophe)
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
        params[key] = value;
      } else {
        const trimmedValue = rawValue.trim();

        if (trimmedValue.startsWith('"') && trimmedValue.endsWith('"') && trimmedValue.length >= 2) {
          // Quoted string: strip outer quotes and unescape
          const inner = trimmedValue.slice(1, trimmedValue.length - 1);
          // Unescape: backslash-quote becomes quote, two consecutive double quotes become one
          value = inner.replace(/\\"/g, '"').replace(/""/g, '"');
        } else {
          value = trimmedValue;
        }

        params[key] = value;
      }
    }
  }

  // If both 'filename' and 'filename*' are present, use filename* value for both
  if ('filename*' in params && 'filename' in params) {
    params['filename'] = params['filename*'];
  } else if ('filename*' in params && !('filename' in params)) {
    // filename* present but no filename key — store under filename* only (already done)
  }

  return { type, params };
}