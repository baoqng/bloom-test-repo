// bloom-deps:

export function parseClaimsPayload(payload: unknown): { sub: string; iss: string; iat: number; exp: number; scope?: string } {
  // Validate payload is a plain object (not null, not array, not primitive)
  if (payload === null || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new TypeError('payload must be an object');
  }

  const p = payload as Record<string, unknown>;

  // Type checks
  if (typeof p['sub'] !== 'string') {
    throw new TypeError('sub must be a string');
  }
  if (typeof p['iss'] !== 'string') {
    throw new TypeError('iss must be a string');
  }
  if (typeof p['iat'] !== 'number') {
    throw new TypeError('iat must be a number');
  }
  if (typeof p['exp'] !== 'number') {
    throw new TypeError('exp must be a number');
  }

  const sub = p['sub'] as string;
  const iss = p['iss'] as string;
  const iat = p['iat'] as number;
  const exp = p['exp'] as number;

  // Range checks for sub and iss
  if (sub.trim().length === 0) {
    throw new RangeError('sub must not be empty');
  }
  if (iss.trim().length === 0) {
    throw new RangeError('iss must not be empty');
  }

  // Range checks for iat
  if (!Number.isFinite(iat) || iat <= 0 || !Number.isInteger(iat)) {
    throw new RangeError('iat must be a positive integer');
  }

  // Range checks for exp
  if (!Number.isFinite(exp) || exp <= 0 || !Number.isInteger(exp)) {
    throw new RangeError('exp must be a positive integer');
  }

  // exp must be greater than iat
  if (exp <= iat) {
    throw new RangeError('exp must be greater than iat');
  }

  // Optional scope validation
  if ('scope' in p && p['scope'] !== undefined) {
    if (typeof p['scope'] !== 'string') {
      throw new TypeError('scope must be a string');
    }
    return {
      sub: sub.trim(),
      iss: iss.trim(),
      iat,
      exp,
      scope: (p['scope'] as string).trim(),
    };
  }

  return {
    sub: sub.trim(),
    iss: iss.trim(),
    iat,
    exp,
  };
}