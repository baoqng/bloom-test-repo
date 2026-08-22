// bloom-deps:

export function parseContentDisposition(header: unknown): { type: string; params: Record<string, string> } {
  if (typeof header !== 'string') {
    throw new TypeError('header must be a string');
  }

  const trimmed = header.trim();
  if (trimmed.length === 0) {
    throw new SyntaxError('Empty Content-Disposition header');
  }

  // Split on the first semicolon
  const semicolonIndex = trimmed.indexOf(';');
  const typeSegment = semicolonIndex === -1 ? trimmed : trimmed.slice(0, semicolonIndex);
  const rest = semicolonIndex === -1 ? '' : trimmed.slice(semicolonIndex + 1);

  const type = typeSegment.trim().toLowerCase();
  if (type.length === 0) {
    throw new SyntaxError('Invalid Content-Disposition type');
  }

  const params: Record<string, string> = {};

  if (rest.length > 0) {
    // Split remaining on semicolons
    const segments = rest.split(';');

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

      const rawKey = seg.slice(0, eqIndex).trim().toLowerCase();
      if (rawKey.length === 0) continue; // empty key, ignore

      const rawValue = seg.slice(eqIndex + 1);

      let value: string;

      if (rawKey === 'filename*') {
        // RFC 5987: strip charset prefix (up to and including first apostrophe pair)
        // Format: charset'language'encoded-value
        const apostropheIndex1 = rawValue.indexOf("'");
        if (apostropheIndex1 !== -1) {
          const apostropheIndex2 = rawValue.indexOf("'", apostropheIndex1 + 1);
          if (apostropheIndex2 !== -1) {
            const encoded = rawValue.slice(apostropheIndex2 + 1);
            try {
              value = decodeURIComponent(encoded);
            } catch {
              value = encoded;
            }
          } else {
            value = rawValue;
          }
        } else {
          value = rawValue;
        }
      } else {
        const trimmedValue = rawValue.trim();
        if (trimmedValue.startsWith('"') && trimmedValue.endsWith('"') && trimmedValue.length >= 2) {
          // Strip outer quotes and unescape
          const inner = trimmedValue.slice(1, trimmedValue.length - 1);
          // Unescape: backslash-quote becomes quote, two consecutive double quotes become one
          value = inner.replace(/\\"/g, '"').replace(/""/g, '"');
        } else {
          value = trimmedValue;
        }
      }

      params[rawKey] = value;
    }
  }

  // If both 'filename' and 'filename*' are present, use filename* value for both
  if ('filename' in params && 'filename*' in params) {
    params['filename'] = params['filename*'];
  }

  return { type, params };
}