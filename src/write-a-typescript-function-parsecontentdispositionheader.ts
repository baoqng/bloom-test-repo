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
  let paramSegments: string[];

  if (semicolonIndex === -1) {
    typeSegment = trimmed;
    paramSegments = [];
  } else {
    typeSegment = trimmed.slice(0, semicolonIndex);
    const rest = trimmed.slice(semicolonIndex + 1);
    paramSegments = splitOnSemicolons(rest);
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
    let key: string;
    let rawValue: string;

    if (eqIndex === -1) {
      key = seg.toLowerCase().trim();
      rawValue = '';
    } else {
      key = seg.slice(0, eqIndex).toLowerCase().trim();
      rawValue = seg.slice(eqIndex + 1);
    }

    if (key.length === 0) continue;

    let value: string;

    if (key === 'filename*') {
      value = parseRfc5987Value(rawValue.trim());
    } else {
      value = parseParamValue(rawValue);
    }

    params[key] = value;
  }

  if ('filename*' in params && 'filename' in params) {
    params['filename'] = params['filename*'];
  } else if ('filename*' in params && !('filename' in params)) {
    params['filename'] = params['filename*'];
  }

  return { type, params };
}

function splitOnSemicolons(str: string): string[] {
  const segments: string[] = [];
  let current = '';
  let inQuotes = false;
  let i = 0;

  while (i < str.length) {
    const ch = str[i];
    if (ch === '\\' && inQuotes && i + 1 < str.length) {
      current += ch + str[i + 1];
      i += 2;
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

  if (current.length > 0 || segments.length > 0) {
    segments.push(current);
  }

  return segments;
}

function parseParamValue(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.startsWith('"') && trimmed.endsWith('"') && trimmed.length >= 2) {
    const inner = trimmed.slice(1, trimmed.length - 1);
    return unescapeQuotedString(inner);
  }
  return trimmed;
}

function unescapeQuotedString(s: string): string {
  let result = '';
  let i = 0;
  while (i < s.length) {
    if (s[i] === '\\' && i + 1 < s.length) {
      const next = s[i + 1];
      if (next === '"') {
        result += '"';
        i += 2;
        continue;
      }
      result += s[i];
      i++;
      continue;
    }
    if (s[i] === '"' && i + 1 < s.length && s[i + 1] === '"') {
      result += '"';
      i += 2;
      continue;
    }
    result += s[i];
    i++;
  }
  return result;
}

function parseRfc5987Value(raw: string): string {
  const firstApos = raw.indexOf("'");
  if (firstApos === -1) {
    return raw;
  }
  const secondApos = raw.indexOf("'", firstApos + 1);
  if (secondApos === -1) {
    return raw;
  }
  const encoded = raw.slice(secondApos + 1);
  try {
    return decodeURIComponent(encoded);
  } catch {
    return encoded;
  }
}

export { parseContentDisposition };