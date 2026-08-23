// bloom-deps:

function parseAcceptHeader(header: unknown): Array<{ mediaType: string, quality: number, params: Record<string, string> }> {
  if (typeof header !== 'string') {
    throw new TypeError('header must be a string');
  }

  if (header.trim().length === 0) {
    return [];
  }

  const entries = header.split(',');
  const result: Array<{ mediaType: string, quality: number, params: Record<string, string>, originalIndex: number }> = [];

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i].trim();
    const segments = entry.split(';');

    const mediaType = segments[0].trim();
    if (mediaType.length === 0) {
      throw new SyntaxError(`Invalid media type at position ${i}`);
    }

    let quality = 1.0;
    const params: Record<string, string> = {};

    for (let j = 1; j < segments.length; j++) {
      const seg = segments[j];
      const eqIdx = seg.indexOf('=');
      let key: string;
      let value: string;

      if (eqIdx === -1) {
        key = seg.trim().toLowerCase();
        value = '';
      } else {
        key = seg.slice(0, eqIdx).trim().toLowerCase();
        value = seg.slice(eqIdx + 1).trim();
      }

      if (key === 'q') {
        const parsed = parseFloat(value);
        if (!isNaN(parsed)) {
          quality = Math.min(1, Math.max(0, parsed));
        }
      } else {
        if (key.length > 0) {
          params[key] = value;
        }
      }
    }

    result.push({ mediaType, quality, params, originalIndex: i });
  }

  function getSpecificity(mediaType: string): number {
    if (mediaType === '*/*') return 0;
    if (mediaType.endsWith('/*')) return 1;
    return 2;
  }

  result.sort((a, b) => {
    if (b.quality !== a.quality) {
      return b.quality - a.quality;
    }
    const specDiff = getSpecificity(b.mediaType) - getSpecificity(a.mediaType);
    if (specDiff !== 0) {
      return specDiff;
    }
    return a.originalIndex - b.originalIndex;
  });

  return result.map(({ mediaType, quality, params }) => ({ mediaType, quality, params }));
}

export { parseAcceptHeader };