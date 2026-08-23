// bloom-deps:

function parseAcceptHeader(header: unknown): Array<{ mediaType: string, quality: number, params: Record<string, string> }> {
  if (typeof header !== 'string') {
    throw new TypeError('header must be a string');
  }

  const trimmed = header.trim();
  if (trimmed.length === 0) {
    return [];
  }

  const entries = trimmed.split(',');
  const result: Array<{ mediaType: string, quality: number, params: Record<string, string>, originalIndex: number }> = [];

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const segments = entry.split(';');

    const mediaType = segments[0].trim();
    if (mediaType.length === 0) {
      throw new SyntaxError(`Invalid media type at position ${i}`);
    }

    let quality = 1.0;
    const params: Record<string, string> = {};

    for (let j = 1; j < segments.length; j++) {
      const segment = segments[j];
      const eqIndex = segment.indexOf('=');
      if (eqIndex === -1) {
        const key = segment.trim().toLowerCase();
        if (key.length > 0) {
          params[key] = '';
        }
        continue;
      }

      const key = segment.slice(0, eqIndex).trim().toLowerCase();
      const value = segment.slice(eqIndex + 1).trim();

      if (key === 'q') {
        const parsed = parseFloat(value);
        if (!isNaN(parsed)) {
          quality = Math.min(1, Math.max(0, parsed));
        }
      } else if (key.length > 0) {
        params[key] = value;
      }
    }

    result.push({ mediaType, quality, params, originalIndex: i });
  }

  function specificity(mediaType: string): number {
    if (mediaType === '*/*') return 0;
    const slashIndex = mediaType.indexOf('/');
    if (slashIndex === -1) return 2;
    const type = mediaType.slice(0, slashIndex);
    const subtype = mediaType.slice(slashIndex + 1);
    if (type === '*') return 0;
    if (subtype === '*') return 1;
    return 2;
  }

  result.sort((a, b) => {
    if (b.quality !== a.quality) {
      return b.quality - a.quality;
    }
    const specDiff = specificity(b.mediaType) - specificity(a.mediaType);
    if (specDiff !== 0) {
      return specDiff;
    }
    return a.originalIndex - b.originalIndex;
  });

  return result.map(({ mediaType, quality, params }) => ({ mediaType, quality, params }));
}

export { parseAcceptHeader };