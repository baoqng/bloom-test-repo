// bloom-deps:

export function parseAcceptHeader(header: unknown): Array<{ mediaType: string, quality: number, params: Record<string, string> }> {
  if (typeof header !== 'string') {
    throw new TypeError('header must be a string');
  }

  if (header.trim() === '') {
    return [];
  }

  const entries = header.split(',');
  const result: Array<{ mediaType: string, quality: number, params: Record<string, string>, originalIndex: number }> = [];

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i].trim();
    const segments = entry.split(';');

    const mediaType = segments[0].trim();

    if (mediaType === '') {
      throw new SyntaxError(`Invalid media type at position ${i}`);
    }

    let quality = 1.0;
    const params: Record<string, string> = {};

    for (let j = 1; j < segments.length; j++) {
      const segment = segments[j];
      const eqIdx = segment.indexOf('=');

      if (eqIdx === -1) {
        const key = segment.trim().toLowerCase();
        if (key !== '') {
          params[key] = '';
        }
        continue;
      }

      const key = segment.slice(0, eqIdx).trim().toLowerCase();
      const value = segment.slice(eqIdx + 1).trim();

      if (key === 'q') {
        const parsed = parseFloat(value);
        if (!isNaN(parsed)) {
          quality = Math.min(1, Math.max(0, parsed));
        }
      } else if (key !== '') {
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