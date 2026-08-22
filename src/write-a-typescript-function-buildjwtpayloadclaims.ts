// bloom-deps:

function buildJwtPayload(
  claims: {
    sub: string;
    iss: string;
    aud: string | string[];
    ttlSeconds: number;
    custom?: Record<string, unknown>;
  }
): {
  sub: string;
  iss: string;
  aud: string | string[];
  iat: number;
  exp: number;
  [key: string]: unknown;
} {
  // Validate claims is a plain object
  if (
    claims === null ||
    typeof claims !== 'object' ||
    Array.isArray(claims) ||
    Object.getPrototypeOf(claims) !== Object.prototype
  ) {
    throw new TypeError('claims must be a plain object');
  }

  const { sub, iss, aud, ttlSeconds, custom } = claims;

  // Validate sub
  if (typeof sub !== 'string' || sub.length === 0) {
    throw new TypeError('sub must be a non-empty string');
  }

  // Validate iss
  if (typeof iss !== 'string' || iss.length === 0) {
    throw new TypeError('iss must be a non-empty string');
  }

  // Validate aud
  if (typeof aud === 'string') {
    if (aud.length === 0) {
      throw new TypeError('aud must be a non-empty string or non-empty array of strings');
    }
  } else if (Array.isArray(aud)) {
    if (aud.length === 0 || !aud.every((a) => typeof a === 'string' && a.length > 0)) {
      throw new TypeError('aud must be a non-empty string or non-empty array of strings');
    }
  } else {
    throw new TypeError('aud must be a non-empty string or non-empty array of strings');
  }

  // Validate ttlSeconds
  if (!Number.isInteger(ttlSeconds) || ttlSeconds < 1) {
    throw new RangeError('ttlSeconds must be a positive integer');
  }

  // Validate custom if provided
  const reservedKeys = new Set(['sub', 'iss', 'aud', 'iat', 'exp']);

  if (custom !== undefined) {
    if (
      custom === null ||
      typeof custom !== 'object' ||
      Array.isArray(custom) ||
      Object.getPrototypeOf(custom) !== Object.prototype
    ) {
      throw new TypeError('custom must be a plain object');
    }

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

export { buildJwtPayload };