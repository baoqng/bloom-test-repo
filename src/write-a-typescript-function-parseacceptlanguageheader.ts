// bloom-deps:

export function parseAcceptLanguage(header: string): Array<{ lang: string; q: number }> {
  if (typeof header !== 'string') {
    throw new TypeError('header must be a string');
  }

  const trimmed = header.trim();
  if (trimmed === '') {
    return [];
  }

  const entries = trimmed.split(',');
  const result: Array<{ lang: string; q: number }> = [];

  for (const entry of entries) {
    const parts = entry.trim().split(';');
    const langTag = parts[0].trim().toLowerCase();

    if (!langTag) {
      continue;
    }

    let q = 1.0;

    if (parts.length > 1) {
      const qPart = parts[1].trim();
      const match = qPart.match(/^q\s*=\s*(.+)$/i);

      if (!match) {
        // Has semicolon section but no valid q= parameter; treat as invalid entry
        continue;
      }

      const qValue = parseFloat(match[1]);

      if (isNaN(qValue) || !isFinite(qValue) || qValue < 0 || qValue > 1) {
        continue;
      }

      q = qValue;
    }

    result.push({ lang: langTag, q });
  }

  result.sort((a, b) => b.q - a.q);

  return result;
}