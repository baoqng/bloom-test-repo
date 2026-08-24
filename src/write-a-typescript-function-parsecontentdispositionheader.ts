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
    if (eqIndex === -1) {
      const key = seg.toLowerCase().trim();
      if (key.length === 0) continue;
      params[key] = '';
      continue;
    }

    const rawKey = seg.slice(0, eqIndex);
    const key = rawKey.toLowerCase().trim();

    if (key.length === 0) continue;

    const rawValue = seg.slice(eqIndex + 1);

    let value: string;

    if (key === 'filename*') {
      value = parseRfc5987Value(rawValue.trim());
    } else {
      value = parseParamValue(rawValue.trim());
    }

    params[key] = value;
  }

  if ('filename*' in params && 'filename' in params) {
    const starValue = params['filename*'];
    params['filename'] = starValue;
  }

  return { type, params };
}

function splitOnSemicolons(input: string): string[] {
  const segments: string[] = [];
  let current = '';
  let inQuotes = false;
  let i = 0;

  while (i < input.length) {
    const ch = input[i];

    if (ch === '"' && !inQuotes) {
      inQuotes = true;
      current += ch;
      i++;
    } else if (ch === '"' && inQuotes) {
      if (input[i + 1] === '"') {
        current += '""';
        i += 2;
      } else {
        inQuotes = false;
        current += ch;
        i++;
      }
    } else if (ch === '\\' && inQuotes) {
      current += ch;
      if (i + 1 < input.length) {
        current += input[i + 1];
        i += 2;
      } else {
        i++;
      }
    } else if (ch === ';' && !inQuotes) {
      segments.push(current);
      current = '';
      i++;
    } else {
      current += ch;
      i++;
    }
  }

  if (current.length > 0 || input.endsWith(';')) {
    segments.push(current);
  }

  return segments;
}

function parseParamValue(raw: string): string {
  if (raw.startsWith('"')) {
    const inner = raw.endsWith('"') && raw.length >= 2
      ? raw.slice(1, raw.length - 1)
      : raw.slice(1);
    return unescapeQuotedString(inner);
  }
  return raw.trim();
}

function unescapeQuotedString(s: string): string {
  let result = '';
  let i = 0;
  while (i < s.length) {
    const ch = s[i];
    if (ch === '\\' && i + 1 < s.length) {
      result += s[i + 1];
      i += 2;
    } else if (ch === '"' && s[i + 1] === '"') {
      result += '"';
      i += 2;
    } else {
      result += ch;
      i++;
    }
  }
  return result;
}

function parseRfc5987Value(raw: string): string {
  const firstApostrophe = raw.indexOf("'");
  if (firstApostrophe === -1) {
    return decodeURIComponentSafe(raw);
  }

  const secondApostrophe = raw.indexOf("'", firstApostrophe + 1);
  if (secondApostrophe === -1) {
    return decodeURIComponentSafe(raw);
  }

  const encodedValue = raw.slice(secondApostrophe + 1);
  return decodeURIComponentSafe(encodedValue);
}

function decodeURIComponentSafe(encoded: string): string {
  try {
    return decodeURIComponent(encoded);
  } catch {
    return encoded;
  }
}

export { parseContentDisposition };