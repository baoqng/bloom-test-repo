// bloom-deps:

function extractJWTPayload(token: unknown): Record<string, unknown> {
  if (typeof token !== 'string' || token.length === 0) {
    throw new TypeError('token must be a non-empty string');
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new SyntaxError('JWT must consist of exactly three period-separated parts');
  }

  const [headerPart, payloadPart] = parts;

  // Validate header: must be valid base64url-encoded JSON
  const decodeBase64url = (input: string): string => {
    const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    return Buffer.from(padded, 'base64').toString('utf8');
  };

  try {
    const headerDecoded = decodeBase64url(headerPart);
    JSON.parse(headerDecoded);
  } catch {
    throw new SyntaxError('JWT header is not valid base64url-encoded JSON');
  }

  // Decode and validate payload
  let payloadDecoded: string;
  try {
    payloadDecoded = decodeBase64url(payloadPart);
  } catch {
    throw new SyntaxError('JWT payload is not valid base64url-encoded data');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(payloadDecoded);
  } catch {
    throw new SyntaxError('JWT payload is not valid JSON');
  }

  if (
    parsed === null ||
    typeof parsed !== 'object' ||
    Array.isArray(parsed)
  ) {
    throw new SyntaxError('JWT payload is not a plain object');
  }

  return parsed as Record<string, unknown>;
}

export { extractJWTPayload };