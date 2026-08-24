// bloom-deps:

function parseAcceptHeader(header: unknown): Array<{ mediaType: string, quality: number, params: Record<string, string> }> {
  if (typeof header !== 'string') {
    throw new TypeError('header must be a string');
  }

  if (header.trim() === '') {
    return [];
  }

  const entries = header.split(',');
  const result: Array<{ mediaType: string, quality: number, params: Record<string, string>, originalIndex: number }> = [];

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const segments = entry.split(';');

    const mediaType = segments[0].trim();

    if (mediaType === '') {
      throw new SyntaxError(`Invalid media type at position ${i}`);
    }

    let quality = 1.0;
    const params: Record<string, string> = {};

    for (let j = 1; j < segments.length; j++) {
      const seg = segments[j];
      const eqIdx = seg.indexOf('=');
      if (eqIdx === -1) {
        const key = seg.trim().toLowerCase();
        if (key !== '') {
          params[key] = '';
        }
        continue;
      }
      const key = seg.slice(0, eqIdx).trim().toLowerCase();
      const value = seg.slice(eqIdx + 1).trim();

      if (key === 'q') {
        const parsed = parseFloat(value);
        if (isFinite(parsed)) {
          quality = Math.min(1, Math.max(0, parsed));
        }
      } else {
        params[key] = value;
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
    const specA = getSpecificity(a.mediaType);
    const specB = getSpecificity(b.mediaType);
    if (specB !== specA) {
      return specB - specA;
    }
    return a.originalIndex - b.originalIndex;
  });

  return result.map(({ mediaType, quality, params }) => ({ mediaType, quality, params }));
}

export { parseAcceptHeader };