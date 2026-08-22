// bloom-deps:

function buildJwtPayload(claims: {
  sub: string;
  iss: string;
  aud: string | string[];
  ttlSeconds: number;
  custom?: Record<string, unknown>;
}): {
  sub: string;
  iss: string;
  aud: string | string[];
  iat: number;
  exp: number;
  [key: string]: unknown;
} {
  // Validate claims is a plain object
  if (claims === null || claims === undefined || Object.getPrototypeOf(claims) !== Object.prototype) {
    throw new TypeError('claims must be a plain object');
  }

  // Validate sub is a non-empty string
  if (typeof claims.sub !== 'string' || claims.sub.length === 0) {
    throw new TypeError('sub must be a non-empty string');
  }

  // Validate iss is a non-empty string
  if (typeof claims.iss !== 'string' || claims.iss.length === 0) {
    throw new TypeError('iss must be a non-empty string');
  }

  // Validate aud is a non-empty string or non-empty array of non-empty strings
  let isValidAud = false;
  if (typeof claims.aud === 'string' && claims.aud.length > 0) {
    isValidAud = true;
  } else if (Array.isArray(claims.aud) && claims.aud.length > 0) {
    isValidAud = claims.aud.every(
      (item) => typeof item === 'string' && item.length > 0
    );
  }
  if (!isValidAud) {
    throw new TypeError(
      'aud must be a non-empty string or non-empty array of strings'
    );
  }

  // Validate ttlSeconds is a positive integer
  if (
    !Number.isInteger(claims.ttlSeconds) ||
    claims.ttlSeconds <= 0
  ) {
    throw new RangeError('ttlSeconds must be a positive integer');
  }

  // Validate custom if provided
  if (claims.custom !== undefined) {
    if (Object.getPrototypeOf(claims.custom) !== Object.prototype) {
      throw new TypeError('custom must be a plain object');
    }

    // Check for reserved keys
    const reservedKeys = ['sub', 'iss', 'aud', 'iat', 'exp'];
    for (const key of Object.keys(claims.custom)) {
      if (reservedKeys.includes(key)) {
        throw new RangeError(
          'custom claims must not use reserved keys: sub, iss, aud, iat, exp'
        );
      }
    }
  }

  // Compute iat and exp
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + claims.ttlSeconds;

  // Build and return payload
  const payload: {
    sub: string;
    iss: string;
    aud: string | string[];
    iat: number;
    exp: number;
    [key: string]: unknown;
  } = {
    sub: claims.sub,
    iss: claims.iss,
    aud: claims.aud,
    iat,
    exp,
  };

  // Merge custom claims
  if (claims.custom) {
    Object.assign(payload, claims.custom);
  }

  return payload;
}

export { buildJwtPayload };