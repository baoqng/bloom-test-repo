// bloom-deps:

function buildRedirectUri(returnTo: unknown, allowedOrigins: unknown): string {
  if (typeof returnTo !== 'string') {
    throw new TypeError('returnTo must be a string');
  }

  const trimmedReturnTo = returnTo.trim();
  if (trimmedReturnTo.length === 0) {
    throw new RangeError('returnTo must not be empty');
  }

  if (
    !Array.isArray(allowedOrigins) ||
    allowedOrigins.length === 0 ||
    !allowedOrigins.every((o) => typeof o === 'string')
  ) {
    throw new TypeError('allowedOrigins must be a non-empty array of strings');
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(trimmedReturnTo);
  } catch {
    throw new RangeError('returnTo is not a valid URL');
  }

  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    throw new RangeError('returnTo must use http or https scheme');
  }

  // Extract origin from raw string to preserve case
  const origin = parsedUrl.protocol + '//' + parsedUrl.host;

  const trimmedOrigins = (allowedOrigins as string[]).map((o) => o.trim());
  const isAllowed = trimmedOrigins.some((allowed) => allowed === origin);

  if (!isAllowed) {
    throw new RangeError('returnTo origin is not in the allowed list');
  }

  return trimmedReturnTo;
}

export { buildRedirectUri };