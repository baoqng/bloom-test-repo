// bloom-deps:

export function parseAcceptHeader(
  header: unknown
): Array<{ mediaType: string; quality: number; params: Record<string, string> }> {
  if (typeof header !== 'string') {
    throw new TypeError('header must be a string');
  }

  if (header.trim() === '') {
    return [];
  }

  const entries = header.split(',');
  const results: Array<{
    mediaType: string;
    quality: number;
    params: Record<string, string>;
    originalIndex: number;
    specificity: number;
  }> = [];

  let position = 0;

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const trimmedEntry = entry.trim();
    const segments = trimmedEntry.split(';');

    const mediaType = segments[0].trim();

    if (mediaType === '') {
      throw new SyntaxError(`Invalid media type at position ${position}`);
    }

    let quality = 1.0;
    const params: Record<string, string> = {};

    for (let j = 1; j < segments.length; j++) {
      const seg = segments[j];
      const eqIndex = seg.indexOf('=');
      if (eqIndex === -1) {
        const key = seg.trim().toLowerCase();
        if (key !== '') {
          params[key] = '';
        }
        continue;
      }
      const key = seg.slice(0, eqIndex).trim().toLowerCase();
      const value = seg.slice(eqIndex + 1).trim();

      if (key === 'q') {
        const parsed = parseFloat(value);
        if (!isNaN(parsed)) {
          quality = Math.min(1, Math.max(0, parsed));
        }
      } else if (key !== '') {
        params[key] = value;
      }
    }

    // Calculate specificity: text/html=2, text/*=1, */*=0
    let specificity: number;
    const [type, subtype] = mediaType.split('/');
    if (type === '*') {
      specificity = 0;
    } else if (subtype === '*') {
      specificity = 1;
    } else {
      specificity = 2;
    }

    results.push({
      mediaType,
      quality,
      params,
      originalIndex: i,
      specificity,
    });

    position += entry.length + 1; // +1 for the comma
  }

  results.sort((a, b) => {
    if (b.quality !== a.quality) {
      return b.quality - a.quality;
    }
    if (b.specificity !== a.specificity) {
      return b.specificity - a.specificity;
    }
    return a.originalIndex - b.originalIndex;
  });

  return results.map(({ mediaType, quality, params }) => ({
    mediaType,
    quality,
    params,
  }));
}