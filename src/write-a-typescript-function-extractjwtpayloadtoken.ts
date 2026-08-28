// bloom-deps:

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function decodeBase64Url(input: string): string {
  // Replace base64url chars with standard base64 chars
  let base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  // Pad to multiple of 4
  const remainder = base64.length % 4;
  if (remainder === 1) {
    throw new SyntaxError('Invalid base64url string: length mod 4 is 1');
  } else if (remainder === 2) {
    base64 += '==';
  } else if (remainder === 3) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64').toString('utf8');
}

export function extractJWTPayload(token: unknown): Record<string, unknown> {
  // Validate token is a non-empty string
  if (typeof token !== 'string' || token.length === 0) {
    throw new TypeError('token must be a non-empty string');
  }

  // Count period occurrences explicitly using indexOf
  let dotCount = 0;
  let idx = 0;
  while (true) {
    const found = token.indexOf('.', idx);
    if (found === -1) break;
    dotCount++;
    idx = found + 1;
  }

  if (dotCount !== 2) {
    throw new SyntaxError('token must consist of exactly three period-separated parts');
  }

  // Extract parts using indexOf+slice (not split)
  const firstDot = token.indexOf('.');
  const headerPart = token.slice(0, firstDot);
  const rest = token.slice(firstDot + 1);
  const secondDot = rest.indexOf('.');
  const payloadPart = rest.slice(0, secondDot);
  // const signaturePart = rest.slice(secondDot + 1); // not needed

  // Validate header: must be valid base64url-encoded JSON
  let headerJson: string;
  try {
    headerJson = decodeBase64Url(headerPart);
  } catch {
    throw new SyntaxError('header is not valid base64url-encoded JSON');
  }

  let headerParsed: unknown;
  try {
    headerParsed = JSON.parse(headerJson);
  } catch {
    throw new SyntaxError('header is not valid base64url-encoded JSON');
  }

  if (!isPlainObject(headerParsed)) {
    throw new SyntaxError('header is not valid base64url-encoded JSON');
  }

  // Decode payload from base64url
  let payloadJson: string;
  try {
    payloadJson = decodeBase64Url(payloadPart);
  } catch {
    throw new SyntaxError('payload is not valid base64url-encoded');
  }

  // Parse payload JSON
  let payloadParsed: unknown;
  try {
    payloadParsed = JSON.parse(payloadJson);
  } catch {
    throw new SyntaxError('decoded payload is not valid JSON');
  }

  // Check payload is a plain object
  if (!isPlainObject(payloadParsed)) {
    throw new SyntaxError('parsed payload is not a plain object');
  }

  return payloadParsed;
}