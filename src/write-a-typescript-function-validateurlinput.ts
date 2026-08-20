// bloom-deps:

function validateUrl(input: unknown): boolean {
  if (typeof input !== 'string' || input.length === 0) {
    return false;
  }

  let url: URL;
  try {
    url = new URL(input);
  } catch {
    return false;
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return false;
  }

  if (!url.hostname || url.hostname.length === 0) {
    return false;
  }

  return true;
}

export { validateUrl };