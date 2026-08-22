// bloom-deps:

function parseContentDisposition(header: unknown): { type: string; params: Record<string, string> } {
  if (typeof header !== 'string') {
    throw new TypeError('header must be a string');
  }

  const trimmed = header.trim();
  if (trimmed.length === 0) {
    throw new SyntaxError('Empty Content-Disposition header');
  }

  const segments = trimmed.split(';');
  const typeSegment = segments[0].trim().toLowerCase();

  if (typeSegment.length === 0) {
    throw new SyntaxError('Invalid Content-Disposition type');
  }

  const params: Record<string, string> = {};
  let filenameStarValue: string | undefined;

  for (let i = 1; i < segments.length; i++) {
    const paramSegment = segments[i].trim();
    const eqIndex = paramSegment.indexOf('=');

    if (eqIndex === -1) {
      continue;
    }

    const key = paramSegment.substring(0, eqIndex).trim().toLowerCase();
    if (key.length === 0) {
      continue;
    }

    let value = paramSegment.substring(eqIndex + 1);

    if (key === 'filename*') {
      const firstApostrophe = value.indexOf("'");
      const secondApostrophe = value.indexOf("'", firstApostrophe + 1);

      if (firstApostrophe !== -1 && secondApostrophe !== -1 && secondApostrophe > firstApostrophe) {
        value = value.substring(secondApostrophe + 1);
      }

      filenameStarValue = percentDecode(value);
    } else {
      value = value.trim();

      if (value.startsWith('"') && value.endsWith('"') && value.length >= 2) {
        value = value.substring(1, value.length - 1);
        value = unescapeQuotedString(value);
      }

      params[key] = value;
    }
  }

  if (filenameStarValue !== undefined) {
    params['filename*'] = filenameStarValue;
    params['filename'] = filenameStarValue;
  }

  return {
    type: typeSegment,
    params,
  };
}

function unescapeQuotedString(value: string): string {
  let result = '';
  let i = 0;

  while (i < value.length) {
    if (value[i] === '\\' && i + 1 < value.length && value[i + 1] === '"') {
      result += '"';
      i += 2;
    } else if (value[i] === '"' && i + 1 < value.length && value[i + 1] === '"') {
      result += '"';
      i += 2;
    } else {
      result += value[i];
      i += 1;
    }
  }

  return result;
}

function percentDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export { parseContentDisposition };