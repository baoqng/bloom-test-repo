// bloom-deps:

function selectContentType(acceptHeader: string, available: string[]): string | null {
  // Validate acceptHeader
  if (typeof acceptHeader !== 'string') {
    throw new TypeError('acceptHeader must be a string');
  }

  // Validate available
  if (!Array.isArray(available)) {
    throw new TypeError('available must be an array of non-empty strings');
  }
  for (const item of available) {
    if (typeof item !== 'string' || item.length === 0) {
      throw new TypeError('available must be an array of non-empty strings');
    }
  }

  // Empty accept header => return available[0]
  const trimmed = acceptHeader.trim();
  if (trimmed === '') {
    return available[0] ?? null;
  }

  // Parse Accept header
  interface Preference {
    type: string;
    subtype: string;
    q: number;
    specificity: number; // 2 = exact, 1 = type/*, 0 = */*
    originalIndex: number;
  }

  const preferences: Preference[] = [];
  const parts = trimmed.split(',');

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i].trim();
    if (!part) continue;

    // Split on semicolons to get media type and parameters
    const segments = part.split(';');
    const mediaType = segments[0].trim().toLowerCase();
    let q = 1.0;

    for (let j = 1; j < segments.length; j++) {
      const param = segments[j].trim();
      if (param.startsWith('q=')) {
        const qVal = parseFloat(param.slice(2));
        if (isFinite(qVal)) {
          q = qVal;
        }
      }
    }

    const slashIdx = mediaType.indexOf('/');
    if (slashIdx === -1) continue;

    const type = mediaType.slice(0, slashIdx);
    const subtype = mediaType.slice(slashIdx + 1);

    let specificity: number;
    if (type === '*' && subtype === '*') {
      specificity = 0;
    } else if (subtype === '*') {
      specificity = 1;
    } else {
      specificity = 2;
    }

    preferences.push({ type, subtype, q, specificity, originalIndex: i });
  }

  // Sort by q descending, then specificity descending, then original order ascending
  preferences.sort((a, b) => {
    if (b.q !== a.q) return b.q - a.q;
    if (b.specificity !== a.specificity) return b.specificity - a.specificity;
    return a.originalIndex - b.originalIndex;
  });

  // Match each preference against available types in order
  for (const pref of preferences) {
    for (const avail of available) {
      const lowerAvail = avail.toLowerCase();
      const slashIdx = lowerAvail.indexOf('/');
      if (slashIdx === -1) continue;

      const availType = lowerAvail.slice(0, slashIdx);
      const availSubtype = lowerAvail.slice(slashIdx + 1);

      if (pref.type === '*' && pref.subtype === '*') {
        // */* matches anything
        return avail;
      } else if (pref.subtype === '*') {
        // type/* matches any type/subtype
        if (pref.type === availType) {
          return avail;
        }
      } else {
        // Exact match
        if (pref.type === availType && pref.subtype === availSubtype) {
          return avail;
        }
      }
    }
  }

  return null;
}

export { selectContentType };