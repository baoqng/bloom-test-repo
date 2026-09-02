// bloom-deps:

export function parseForwardedHeader(header: string): string {
  if (typeof header !== 'string') {
    throw new TypeError('header must be a non-empty string');
  }

  if (!header.trim()) {
    throw new TypeError('header must be a non-empty string');
  }

  const parts = header.split(',');
  let hasValidEntry = false;
  let firstToken: string | undefined;

  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.length > 0) {
      if (!hasValidEntry) {
        firstToken = trimmed;
      }
      hasValidEntry = true;
      break;
    }
  }

  if (!hasValidEntry || firstToken === undefined) {
    throw new TypeError('no valid address in header');
  }

  return firstToken;
}