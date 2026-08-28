// bloom-deps:

export interface JwtClaims {
  sub: string;
  exp: number;
  iat: number;
  scope: string[];
}

function base64urlDecode(str: string): string {
  // Convert base64url to base64
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  // Add padding
  const remainder = base64.length % 4;
  if (remainder === 2) {
    base64 += '==';
  } else if (remainder === 3) {
    base64 += '=';
  } else if (remainder === 1) {
    throw new SyntaxError('Malformed JWT: invalid base64url payload');
  }

  // Validate base64 characters
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64)) {
    throw new SyntaxError('Malformed JWT: invalid base64url payload');
  }

  // Check padding position: first '=' must be at index >= length-2
  const firstEq = base64.indexOf('=');
  if (firstEq !== -1 && firstEq < base64.length - 2) {
    throw new SyntaxError('Malformed JWT: invalid base64url payload');
  }

  try {
    // Decode base64 to binary string
    const binaryStr = atob(base64);
    // Convert binary string to UTF-8
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  } catch {
    throw new SyntaxError('Malformed JWT: invalid base64url payload');
  }
}

export function parseJwtClaims(token: unknown): JwtClaims {
  // Validate input type
  if (typeof token !== 'string' || token.length === 0) {
    throw new TypeError('token must be a non-empty string');
  }

  // Count dots using indexOf+slice to ensure exactly two dots (three parts)
  const firstDot = token.indexOf('.');
  if (firstDot === -1) {
    throw new SyntaxError('Malformed JWT: expected three dot-separated parts');
  }

  const rest = token.slice(firstDot + 1);
  const secondDot = rest.indexOf('.');
  if (secondDot === -1) {
    throw new SyntaxError('Malformed JWT: expected three dot-separated parts');
  }

  // Ensure there is no third dot
  const afterSecond = rest.slice(secondDot + 1);
  if (afterSecond.indexOf('.') !== -1) {
    throw new SyntaxError('Malformed JWT: expected three dot-separated parts');
  }

  // Extract payload segment (between first and second dot)
  const payloadSegment = rest.slice(0, secondDot);

  if (payloadSegment.length === 0) {
    throw new SyntaxError('Malformed JWT: invalid base64url payload');
  }

  // Decode payload
  let decoded: string;
  try {
    decoded = base64urlDecode(payloadSegment);
  } catch {
    throw new SyntaxError('Malformed JWT: invalid base64url payload');
  }

  // Parse JSON
  let claims: unknown;
  try {
    claims = JSON.parse(decoded);
  } catch {
    throw new SyntaxError('Malformed JWT: invalid base64url payload');
  }

  if (typeof claims !== 'object' || claims === null || Array.isArray(claims)) {
    throw new SyntaxError('Malformed JWT: invalid base64url payload');
  }

  const claimsObj = claims as Record<string, unknown>;

  // Validate required fields
  if (typeof claimsObj['sub'] !== 'string') {
    throw new SyntaxError('Malformed JWT: invalid base64url payload');
  }
  if (typeof claimsObj['exp'] !== 'number') {
    throw new SyntaxError('Malformed JWT: invalid base64url payload');
  }
  if (typeof claimsObj['iat'] !== 'number') {
    throw new SyntaxError('Malformed JWT: invalid base64url payload');
  }

  // Handle scope field
  let scope: string[];
  if (Array.isArray(claimsObj['scope'])) {
    scope = claimsObj['scope'] as string[];
  } else if (typeof claimsObj['scope'] === 'string') {
    scope = claimsObj['scope'] ? claimsObj['scope'].split(' ') : [];
  } else if (claimsObj['scope'] === undefined || claimsObj['scope'] === null) {
    scope = [];
  } else {
    throw new SyntaxError('Malformed JWT: invalid base64url payload');
  }

  const sub = claimsObj['sub'] as string;
  const exp = claimsObj['exp'] as number;
  const iat = claimsObj['iat'] as number;

  // Check expiration
  const nowSeconds = Math.floor(Date.now() / 1000);
  if (exp < nowSeconds) {
    throw new RangeError('JWT has expired');
  }

  return { sub, exp, iat, scope };
}