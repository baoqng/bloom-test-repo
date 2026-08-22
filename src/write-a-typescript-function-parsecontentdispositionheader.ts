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
    paramSegments = splitParams(rest);
  }

  const type = typeSegment.trim().toLowerCase();
  if (type.length === 0) {
    throw new SyntaxError('Invalid Content-Disposition type');
  }

  const params: Record<string, string> = {};

  for (const segment of paramSegments) {
    const seg = segment.trim();
    if (seg.length === 0) continue;

    const eqIndex = seg.indexOf('=');
    if (eqIndex === -1) continue;

    const key = seg.slice(0, eqIndex).trim().toLowerCase();
    if (key.length === 0) continue;

    const rawValue = seg.slice(eqIndex + 1);

    let value: string;
    if (rawValue.trimStart().startsWith('"')) {
      const inner = rawValue.trim();
      // Strip outer quotes
      const unquoted = inner.slice(1, inner.lastIndexOf('"'));
      // Unescape: backslash-quote becomes quote, two consecutive double quotes become one
      value = unquoted.replace(/\\"/g, '"').replace(/""/g, '"');
    } else {
      value = rawValue.trim();
    }

    if (key === 'filename*') {
      // RFC 5987: strip charset prefix (charset'language'value)
      value = decodeRfc5987(value);
    }

    params[key] = value;
  }

  // If both filename and filename* are present, use filename* value for both
  if ('filename*' in params && 'filename' in params) {
    params['filename'] = params['filename*'];
  } else if ('filename*' in params && !('filename' in params)) {
    params['filename'] = params['filename*'];
  }

  return { type, params };
}

function decodeRfc5987(value: string): string {
  // Format: charset'language'encoded-value
  // Strip charset prefix (part before and including first apostrophe pair)
  const firstApos = value.indexOf("'");
  if (firstApos !== -1) {
    const secondApos = value.indexOf("'", firstApos + 1);
    if (secondApos !== -1) {
      const encoded = value.slice(secondApos + 1);
      try {
        return decodeURIComponent(encoded);
      } catch {
        return encoded;
      }
    }
  }
  // No charset prefix, try to percent-decode as-is
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function splitParams(rest: string): string[] {
  // Split on semicolons, but respect quoted strings
  const segments: string[] = [];
  let current = '';
  let inQuotes = false;
  let i = 0;

  while (i < rest.length) {
    const ch = rest[i];

    if (ch === '\\' && inQuotes) {
      current += ch;
      i++;
      if (i < rest.length) {
        current += rest[i];
        i++;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = !inQuotes;
      current += ch;
      i++;
      continue;
    }

    if (ch === ';' && !inQuotes) {
      segments.push(current);
      current = '';
      i++;
      continue;
    }

    current += ch;
    i++;
  }

  if (current.length > 0 || rest.endsWith(';')) {
    segments.push(current);
  }

  return segments;
}