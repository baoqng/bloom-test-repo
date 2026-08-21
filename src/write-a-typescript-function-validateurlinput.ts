// bloom-deps:

function validateUrl(input: unknown): boolean {
  if (typeof input !== 'string' || input.length === 0) return false;
  try {
    const url = new URL(input);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;
    if (!url.hostname || url.hostname.length === 0) return false;
    return true;
  } catch {
    return false;
  }
}

export { validateUrl };