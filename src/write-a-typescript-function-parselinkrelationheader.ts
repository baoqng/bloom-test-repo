// bloom-deps:

function parseLinkRelation(header: unknown): { url: string; rel: string; params: Record<string, string> }[] {
  if (typeof header !== 'string') {
    throw new TypeError('header must be a string');
  }

  if (!header.trim()) {
    throw new RangeError('header must not be empty');
  }

  const segments = header.split(',');
  const results: { url: string; rel: string; params: Record<string, string> }[] = [];

  for (const segment of segments) {
    const trimmed = segment.trim();

    if (!trimmed) {
      continue;
    }

    if (!trimmed.startsWith('<') || !trimmed.includes('>')) {
      throw new SyntaxError('invalid link segment');
    }

    const closingAngle = trimmed.indexOf('>');
    const url = trimmed.slice(1, closingAngle);

    if (!url) {
      throw new SyntaxError('link URL must not be empty');
    }

    const remainder = trimmed.slice(closingAngle + 1);
    const parts = remainder.split(';');

    let rel: string | undefined;
    const params: Record<string, string> = {};

    for (const part of parts) {
      const trimmedPart = part.trim();

      if (!trimmedPart) {
        continue;
      }

      const eqIndex = trimmedPart.indexOf('=');
      if (eqIndex === -1) {
        continue;
      }

      const key = trimmedPart.slice(0, eqIndex).trim().toLowerCase();
      let value = trimmedPart.slice(eqIndex + 1).trim();

      if (value.startsWith('"') && value.endsWith('"') && value.length >= 2) {
        value = value.slice(1, -1);
      }

      if (key === 'rel') {
        rel = value;
      } else {
        params[key] = value;
      }
    }

    if (rel === undefined) {
      throw new SyntaxError('link segment missing rel attribute');
    }

    results.push({ url, rel, params });
  }

  return results;
}

export { parseLinkRelation };