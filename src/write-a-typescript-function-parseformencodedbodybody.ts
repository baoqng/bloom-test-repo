// bloom-deps:

function parseFormEncodedBody(body: unknown): Record<string, string> {
  if (typeof body !== 'string') {
    throw new TypeError('body must be a string');
  }

  if (body === '') {
    return {};
  }

  const result: Record<string, string> = {};
  const segments = body.split('&');

  for (const segment of segments) {
    if (segment === '') {
      continue;
    }

    const raw = segment;

    // Split on first '=' only using indexOf+slice
    const eqIndex = segment.indexOf('=');

    let rawKey: string;
    let rawValue: string;

    if (eqIndex === -1) {
      rawKey = segment;
      rawValue = '';
    } else {
      rawKey = segment.slice(0, eqIndex);
      rawValue = segment.slice(eqIndex + 1);
    }

    // Replace '+' with space before percent-decoding
    const normalizedKey = rawKey.replace(/\+/g, ' ');
    const normalizedValue = rawValue.replace(/\+/g, ' ');

    let decodedKey: string;
    let decodedValue: string;

    try {
      decodedKey = decodeURIComponent(normalizedKey);
    } catch {
      throw new SyntaxError(`Malformed percent-encoding in segment '${raw}'`);
    }

    try {
      decodedValue = decodeURIComponent(normalizedValue);
    } catch {
      throw new SyntaxError(`Malformed percent-encoding in segment '${raw}'`);
    }

    if (decodedKey === '') {
      throw new SyntaxError(`Empty key in segment '${raw}'`);
    }

    result[decodedKey] = decodedValue;
  }

  return result;
}

export { parseFormEncodedBody };