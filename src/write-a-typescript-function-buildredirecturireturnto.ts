// bloom-deps:

function buildRedirectUri(returnTo: unknown, allowedOrigins: unknown): string {
  // Validate returnTo is a string
  if (typeof returnTo !== 'string') {
    throw new TypeError('returnTo must be a string');
  }

  // Validate returnTo is not empty or whitespace-only
  const trimmedReturnTo = returnTo.trim();
  if (trimmedReturnTo.length === 0) {
    throw new RangeError('returnTo must not be empty');
  }

  // Validate allowedOrigins is a non-empty array of strings
  if (
    !Array.isArray(allowedOrigins) ||
    allowedOrigins.length === 0 ||
    !allowedOrigins.every((origin) => typeof origin === 'string')
  ) {
    throw new TypeError('allowedOrigins must be a non-empty array of strings');
  }

  // Parse returnTo as a URL
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(trimmedReturnTo);
  } catch {
    throw new RangeError('returnTo is not a valid URL');
  }

  // Validate protocol is http or https
  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    throw new RangeError('returnTo must use http or https scheme');
  }

  // Extract origin from raw string to preserve case
  const originMatch = trimmedReturnTo.match(/^([a-zA-Z][a-zA-Z0-9+.-]*:\/\/[^\/]+)/);
  if (!originMatch) {
    throw new RangeError('returnTo origin is not in the allowed list');
  }

  const origin = originMatch[1];

  // Check if origin matches any entry in allowedOrigins (case-sensitive, trimmed)
  const trimmedAllowedOrigins = allowedOrigins.map((o) => (o as string).trim());
  const isOriginAllowed = trimmedAllowedOrigins.some((allowed) => origin === allowed);

  if (!isOriginAllowed) {
    throw new RangeError('returnTo origin is not in the allowed list');
  }

  // Return the original trimmed returnTo string
  return trimmedReturnTo;
}

export { buildRedirectUri };