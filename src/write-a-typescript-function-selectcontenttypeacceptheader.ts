// bloom-deps:

class ServiceError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'ServiceError';
  }
}

interface ParsedPreference {
  type: string;
  subtype: string;
  q: number;
  specificity: number; // 2 = exact, 1 = type/*, 0 = */*
  originalIndex: number;
}

function parseAcceptHeader(acceptHeader: string): ParsedPreference[] {
  if (acceptHeader.trim() === '') {
    return [];
  }

  const parts = acceptHeader.split(',');
  const preferences: ParsedPreference[] = [];

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i].trim();
    if (!part) continue;

    const segments = part.split(';');
    const mediaType = segments[0].trim();

    let q = 1.0;
    for (let j = 1; j < segments.length; j++) {
      const param = segments[j].trim();
      if (param.startsWith('q=')) {
        const qVal = parseFloat(param.slice(2));
        if (!isNaN(qVal)) {
          q = qVal;
        }
      }
    }

    const slashIndex = mediaType.indexOf('/');
    if (slashIndex === -1) continue;

    const type = mediaType.slice(0, slashIndex).trim();
    const subtype = mediaType.slice(slashIndex + 1).trim();

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

  // Sort by q descending, then by specificity descending, then by original order ascending
  preferences.sort((a, b) => {
    if (b.q !== a.q) return b.q - a.q;
    if (b.specificity !== a.specificity) return b.specificity - a.specificity;
    return a.originalIndex - b.originalIndex;
  });

  return preferences;
}

function matchesPreference(available: string, pref: ParsedPreference): boolean {
  const slashIndex = available.indexOf('/');
  if (slashIndex === -1) return false;

  const availType = available.slice(0, slashIndex).trim();
  const availSubtype = available.slice(slashIndex + 1).trim();

  if (pref.type === '*' && pref.subtype === '*') {
    return true;
  }

  if (pref.subtype === '*') {
    return pref.type.toLowerCase() === availType.toLowerCase();
  }

  return (
    pref.type.toLowerCase() === availType.toLowerCase() &&
    pref.subtype.toLowerCase() === availSubtype.toLowerCase()
  );
}

export function selectContentType(
  acceptHeader: string,
  available: string[]
): string | null {
  // Type validation
  if (typeof acceptHeader !== 'string') {
    throw new TypeError('acceptHeader must be a string');
  }

  if (!Array.isArray(available)) {
    throw new TypeError('available must be an Array of non-empty strings');
  }

  for (const item of available) {
    if (typeof item !== 'string' || item.length === 0) {
      throw new TypeError('available must be an Array of non-empty strings');
    }
  }

  // Empty accept header => return first available
  if (acceptHeader.trim() === '') {
    return available.length > 0 ? available[0] : null;
  }

  const preferences = parseAcceptHeader(acceptHeader);

  // Match preferences in priority order against available types
  for (const pref of preferences) {
    // Skip preferences with q=0 (explicitly not accepted)
    if (pref.q === 0) continue;

    for (const avail of available) {
      if (matchesPreference(avail, pref)) {
        return avail;
      }
    }
  }

  return null;
}