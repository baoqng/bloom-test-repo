// bloom-deps:

export function parseHeaderValue(header: unknown, directive: string): string | null {
  if (typeof header !== 'string') {
    throw new TypeError('header must be a string');
  }
  if (typeof directive !== 'string' || directive === '') {
    throw new TypeError('directive must be a non-empty string');
  }

  const segments = header.split(';');
  const directiveLower = directive.toLowerCase();

  for (const segment of segments) {
    const trimmed = segment.trim();
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) {
      continue;
    }
    const key = trimmed.slice(0, eqIndex).trim().toLowerCase();
    if (key === directiveLower) {
      let value = trimmed.slice(eqIndex + 1).trim();
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      return value;
    }
  }

  return null;
}