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
    !allowedOrigins.every((element) => typeof element === 'string')
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

  const originMatch = trimmedReturnTo.split('/').slice(0, 3).join('/');

  const isAllowed = (allowedOrigins as string[]).some(
    (allowed) => allowed.trim() === originMatch
  );

  if (!isAllowed) {
    throw new RangeError('returnTo origin is not in the allowed list');
  }

  return trimmedReturnTo;
}

export { buildRedirectUri };