// bloom-deps:

function extractJWTPayload(token: unknown): Record<string, unknown> {
  if (typeof token !== 'string' || token.length === 0) {
    throw new TypeError('token must be a non-empty string');
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new SyntaxError('token must consist of exactly three period-separated parts');
  }

  const [headerPart, payloadPart] = parts;

  // Validate header (first part) is valid base64url-encoded JSON
  const decodeBase64url = (input: string): string => {
    const replaced = input.replace(/-/g, '+').replace(/_/g, '/');
    const padded = replaced + '='.repeat((4 - (replaced.length % 4)) % 4);
    return Buffer.from(padded, 'base64').toString('utf8');
  };

  let headerDecoded: string;
  try {
    headerDecoded = decodeBase64url(headerPart);
  } catch {
    throw new SyntaxError('header is not valid base64url-encoded JSON');
  }

  try {
    const headerParsed = JSON.parse(headerDecoded);
    if (typeof headerParsed !== 'object' || headerParsed === null || Array.isArray(headerParsed)) {
      throw new SyntaxError('header is not valid base64url-encoded JSON');
    }
  } catch (err) {
    if (err instanceof SyntaxError) {
      throw err;
    }
    throw new SyntaxError('header is not valid base64url-encoded JSON');
  }

  // Decode payload (second part)
  let payloadDecoded: string;
  try {
    payloadDecoded = decodeBase64url(payloadPart);
  } catch {
    throw new SyntaxError('payload is not valid base64url-encoded data');
  }

  let payloadParsed: unknown;
  try {
    payloadParsed = JSON.parse(payloadDecoded);
  } catch {
    throw new SyntaxError('decoded payload is not valid JSON');
  }

  if (
    typeof payloadParsed !== 'object' ||
    payloadParsed === null ||
    Array.isArray(payloadParsed)
  ) {
    throw new SyntaxError('parsed payload is not a plain object');
  }

  return payloadParsed as Record<string, unknown>;
}

export { extractJWTPayload };