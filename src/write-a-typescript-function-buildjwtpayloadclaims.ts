// bloom-deps:

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

export function buildJwtPayload(
  claims: {
    sub: string;
    iss: string;
    aud: string | string[];
    ttlSeconds: number;
    custom?: Record<string, unknown>;
  }
): { sub: string; iss: string; aud: string | string[]; iat: number; exp: number; [key: string]: unknown } {
  if (!isPlainObject(claims)) {
    throw new TypeError('claims must be a plain object');
  }

  const { sub, iss, aud, ttlSeconds, custom } = claims;

  if (typeof sub !== 'string' || sub.length === 0) {
    throw new TypeError('sub must be a non-empty string');
  }

  if (typeof iss !== 'string' || iss.length === 0) {
    throw new TypeError('iss must be a non-empty string');
  }

  if (typeof aud === 'string') {
    if (aud.length === 0) {
      throw new TypeError('aud must be a non-empty string or non-empty array of strings');
    }
  } else if (Array.isArray(aud)) {
    if (aud.length === 0 || !aud.every((item) => typeof item === 'string' && item.length > 0)) {
      throw new TypeError('aud must be a non-empty string or non-empty array of strings');
    }
  } else {
    throw new TypeError('aud must be a non-empty string or non-empty array of strings');
  }

  if (!Number.isInteger(ttlSeconds) || ttlSeconds < 1) {
    throw new RangeError('ttlSeconds must be a positive integer');
  }

  if (custom !== undefined) {
    if (!isPlainObject(custom)) {
      throw new TypeError('custom must be a plain object');
    }

    const reservedKeys = new Set(['sub', 'iss', 'aud', 'iat', 'exp']);
    for (const key of Object.keys(custom)) {
      if (reservedKeys.has(key)) {
        throw new RangeError('custom claims must not use reserved keys: sub, iss, aud, iat, exp');
      }
    }
  }

  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + ttlSeconds;

  return {
    sub,
    iss,
    aud,
    iat,
    exp,
    ...(custom ?? {}),
  };
}