// bloom-deps:

export function parseAcceptLanguage(header: unknown): string {
  if (typeof header !== 'string') {
    throw new TypeError('header must be a string');
  }

  if (header.trim().length === 0) {
    throw new RangeError('header must not be empty');
  }

  const entries: Array<{ tag: string; q: number }> = [];

  const parts = header.split(',');

  for (const part of parts) {
    const trimmedPart = part.trim();
    if (trimmedPart.length === 0) continue;

    // Find the semicolon separating tag from q-factor
    const semicolonIndex = trimmedPart.indexOf(';');

    let tag: string;
    let q: number;

    if (semicolonIndex === -1) {
      tag = trimmedPart.trim();
      q = 1.0;
    } else {
      tag = trimmedPart.slice(0, semicolonIndex).trim();
      const qPart = trimmedPart.slice(semicolonIndex + 1).trim();

      // Parse q= value
      const eqIndex = qPart.indexOf('=');
      if (eqIndex === -1) {
        // Malformed, treat as q=1.0
        q = 1.0;
      } else {
        const qKey = qPart.slice(0, eqIndex).trim();
        const qVal = qPart.slice(eqIndex + 1).trim();

        if (qKey.toLowerCase() === 'q') {
          const parsed = parseFloat(qVal);
          q = isNaN(parsed) ? 1.0 : parsed;
        } else {
          q = 1.0;
        }
      }
    }

    if (tag.length === 0) continue;

    // Exclude q=0.0 tags
    if (q === 0.0) continue;

    entries.push({ tag, q });
  }

  if (entries.length === 0) {
    throw new RangeError('no acceptable language');
  }

  // Find the entry with the highest q-factor; first in source order wins ties
  let best = entries[0];
  for (let i = 1; i < entries.length; i++) {
    if (entries[i].q > best.q) {
      best = entries[i];
    }
  }

  return best.tag;
}