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
  let typeSegment: string;
  let paramSegments: string[];

  if (semicolonIndex === -1) {
    typeSegment = trimmed;
    paramSegments = [];
  } else {
    typeSegment = trimmed.slice(0, semicolonIndex);
    const rest = trimmed.slice(semicolonIndex + 1);
    paramSegments = rest.split(';');
  }

  const type = typeSegment.trim().toLowerCase();
  if (type.length === 0) {
    throw new SyntaxError('Invalid Content-Disposition type');
  }

  const params: Record<string, string> = {};

  for (const segment of paramSegments) {
    const trimmedSegment = segment.trim();
    if (trimmedSegment.length === 0) continue;

    const eqIndex = trimmedSegment.indexOf('=');
    if (eqIndex === -1) {
      const key = trimmedSegment.toLowerCase().trim();
      if (key.length === 0) continue;
      params[key] = '';
      continue;
    }

    const key = trimmedSegment.slice(0, eqIndex).toLowerCase().trim();
    if (key.length === 0) continue;

    const rawValue = trimmedSegment.slice(eqIndex + 1);

    let value: string;
    const trimmedValue = rawValue.trim();

    if (trimmedValue.startsWith('"')) {
      // Quoted string: strip outer quotes and unescape
      const inner = trimmedValue.endsWith('"') && trimmedValue.length >= 2
        ? trimmedValue.slice(1, trimmedValue.length - 1)
        : trimmedValue.slice(1);
      // Unescape: backslash-quote -> quote, two consecutive double quotes -> one
      value = inner.replace(/\\"/g, '"').replace(/""/g, '"');
    } else {
      value = trimmedValue;
    }

    if (key === 'filename*') {
      // RFC 5987: strip charset prefix (charset'language'value)
      // The format is: charset'language'encoded-value
      const apostrophe1 = value.indexOf("'");
      if (apostrophe1 !== -1) {
        const apostrophe2 = value.indexOf("'", apostrophe1 + 1);
        if (apostrophe2 !== -1) {
          const encodedValue = value.slice(apostrophe2 + 1);
          try {
            value = decodeURIComponent(encodedValue);
          } catch {
            value = encodedValue;
          }
        }
      }
    }

    params[key] = value;
  }

  // If both 'filename' and 'filename*' are present, use 'filename*' value for both
  if ('filename*' in params && 'filename' in params) {
    params['filename'] = params['filename*'];
  } else if ('filename*' in params && !('filename' in params)) {
    // filename* present but no filename — just store under filename* key (already done)
  }

  return { type, params };
}