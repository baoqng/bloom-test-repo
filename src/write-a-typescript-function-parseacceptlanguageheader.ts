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

    // Find the semicolon separating tag from parameters
    const semicolonIdx = trimmedPart.indexOf(';');

    let tag: string;
    let q = 1.0;

    if (semicolonIdx === -1) {
      tag = trimmedPart.trim();
    } else {
      tag = trimmedPart.slice(0, semicolonIdx).trim();
      const paramsPart = trimmedPart.slice(semicolonIdx + 1).trim();

      // Look for q= parameter, handling whitespace around the equals sign
      const qMatch = paramsPart.match(/q\s*=\s*([^\s;]+)/);
      if (qMatch) {
        const rawQ = qMatch[1];
        const parsed = parseFloat(rawQ);
        if (!isNaN(parsed)) {
          q = parsed;
        }
      }
    }

    if (tag.length === 0) continue;

    entries.push({ tag, q });
  }

  // Filter out q=0.0 entries
  const acceptable = entries.filter(e => e.q !== 0.0);

  if (acceptable.length === 0) {
    throw new RangeError('no acceptable language');
  }

  // Find the entry with the highest q-factor, first in source order wins ties
  let best = acceptable[0];
  for (let i = 1; i < acceptable.length; i++) {
    if (acceptable[i].q > best.q) {
      best = acceptable[i];
    }
  }

  return best.tag;
}