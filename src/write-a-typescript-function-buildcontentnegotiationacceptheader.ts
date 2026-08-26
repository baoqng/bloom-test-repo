// bloom-deps:

export function buildContentNegotiation(acceptHeader: unknown, supported: unknown): string {
  if (typeof acceptHeader !== 'string') {
    throw new TypeError('acceptHeader must be a string');
  }
  if (
    !Array.isArray(supported) ||
    supported.length === 0 ||
    !supported.every((item) => typeof item === 'string')
  ) {
    throw new TypeError('supported must be a non-empty array of strings');
  }
  for (const item of supported as string[]) {
    if (item === '') {
      throw new RangeError('supported elements must not be empty strings');
    }
  }

  const supportedArr = supported as string[];

  interface AcceptEntry {
    type: string;
    subtype: string;
    q: number;
  }

  const acceptEntries: AcceptEntry[] = acceptHeader
    .split(',')
    .map((part) => part.trim())
    .filter((part) => part.length > 0)
    .map((part) => {
      const segments = part.split(';').map((s) => s.trim());
      const mediaType = segments[0].toLowerCase();
      let q = 1.0;
      for (let i = 1; i < segments.length; i++) {
        const param = segments[i];
        if (param.startsWith('q=')) {
          const qVal = parseFloat(param.slice(2));
          if (!isNaN(qVal)) {
            q = qVal;
          }
        }
      }
      const slashIndex = mediaType.indexOf('/');
      let type: string;
      let subtype: string;
      if (slashIndex === -1) {
        type = mediaType;
        subtype = '*';
      } else {
        type = mediaType.slice(0, slashIndex);
        subtype = mediaType.slice(slashIndex + 1);
      }
      return { type, subtype, q };
    });

  // For each supported type, find the best matching q-factor
  let bestSupported: string | null = null;
  let bestQ = -Infinity;

  for (const supportedType of supportedArr) {
    const lowerSupported = supportedType.toLowerCase();
    const slashIndex = lowerSupported.indexOf('/');
    let sType: string;
    let sSubtype: string;
    if (slashIndex === -1) {
      sType = lowerSupported;
      sSubtype = '';
    } else {
      sType = lowerSupported.slice(0, slashIndex);
      sSubtype = lowerSupported.slice(slashIndex + 1);
    }

    let matchQ: number | null = null;
    let matchSpecificity = -1;

    for (const entry of acceptEntries) {
      let specificity = -1;
      let matches = false;

      if (entry.type === '*' && entry.subtype === '*') {
        // wildcard */*
        matches = true;
        specificity = 0;
      } else if (entry.subtype === '*') {
        // type/*
        if (entry.type === sType) {
          matches = true;
          specificity = 1;
        }
      } else {
        // exact match
        if (entry.type === sType && entry.subtype === sSubtype) {
          matches = true;
          specificity = 2;
        }
      }

      if (matches) {
        if (specificity > matchSpecificity) {
          matchSpecificity = specificity;
          matchQ = entry.q;
        } else if (specificity === matchSpecificity && matchQ !== null && entry.q > matchQ) {
          matchQ = entry.q;
        }
      }
    }

    if (matchQ !== null) {
      if (matchQ > bestQ) {
        bestQ = matchQ;
        bestSupported = supportedType;
      }
      // If matchQ === bestQ, keep the first match (do nothing)
    }
  }

  if (bestSupported === null) {
    throw new RangeError('No acceptable content type');
  }

  return bestSupported;
}