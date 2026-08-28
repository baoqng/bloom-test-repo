// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (value === null) return false;
  if (typeof value !== 'object') return false;
  if (Array.isArray(value)) return false;
  
  // Walk the full prototype chain
  let proto = Object.getPrototypeOf(value);
  while (proto !== null) {
    if (proto === Object.prototype) {
      // Check that the next level is null (i.e., Object.prototype is the direct proto)
      // Actually we need to check if it's a plain object by verifying prototype chain
      break;
    }
    proto = Object.getPrototypeOf(proto);
  }
  
  // Re-check: plain object means prototype is Object.prototype or null
  const directProto = Object.getPrototypeOf(value);
  if (directProto !== Object.prototype && directProto !== null) return false;
  
  return true;
}

function base64urlEncode(input: string): string {
  const bytes = Buffer.from(input, 'utf8');
  const base64 = bytes.toString('base64');
  // Convert to base64url: replace + with -, / with _, remove padding =
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

export function buildJwtPayload(subject: unknown, ttlSeconds: unknown, claims: unknown): string {
  // Validate subject
  if (typeof subject !== 'string' || subject.length === 0) {
    throw new TypeError('subject must be a non-empty string');
  }

  // Validate ttlSeconds: must be a positive integer
  if (
    typeof ttlSeconds !== 'number' ||
    !Number.isInteger(ttlSeconds) ||
    ttlSeconds <= 0 ||
    !Number.isFinite(ttlSeconds)
  ) {
    throw new TypeError('ttlSeconds must be a positive integer');
  }

  // Validate claims: must be a plain object
  if (!isPlainObject(claims)) {
    throw new TypeError('claims must be a plain object');
  }

  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + (ttlSeconds as number);

  // Build payload: start with claims (excluding reserved keys), then set reserved keys
  const payload: Record<string, unknown> = {};

  // Copy claims entries, skipping reserved keys
  const claimsObj = claims as Record<string, unknown>;
  for (const key of Object.keys(claimsObj)) {
    if (key === 'sub' || key === 'iat' || key === 'exp') continue;
    payload[key] = claimsObj[key];
  }

  // Set reserved keys (these are not overrideable by claims)
  payload['sub'] = subject;
  payload['iat'] = iat;
  payload['exp'] = exp;

  const json = JSON.stringify(payload);
  return base64urlEncode(json);
}