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
    throw new TypeError("claims must be a plain object");
  }

  // Validate sub
  if (typeof claims.sub !== "string" || claims.sub.length === 0) {
    throw new TypeError("sub must be a non-empty string");
  }

  // Validate iss
  if (typeof claims.iss !== "string" || claims.iss.length === 0) {
    throw new TypeError("iss must be a non-empty string");
  }

  // Validate aud
  let validAud = false;
  if (typeof claims.aud === "string" && claims.aud.length > 0) {
    validAud = true;
  } else if (Array.isArray(claims.aud) && claims.aud.length > 0) {
    validAud = claims.aud.every(
      (a) => typeof a === "string" && a.length > 0
    );
  }
  if (!validAud) {
    throw new TypeError(
      "aud must be a non-empty string or non-empty array of strings"
    );
  }

  // Validate ttlSeconds
  if (!Number.isInteger(claims.ttlSeconds) || claims.ttlSeconds <= 0) {
    throw new RangeError("ttlSeconds must be a positive integer");
  }

  // Validate custom if provided
  if (claims.custom !== undefined) {
    if (claims.custom === null || Object.getPrototypeOf(claims.custom) !== Object.prototype) {
      throw new TypeError("custom must be a plain object");
    }

    const reservedKeys = ["sub", "iss", "aud", "iat", "exp"];
    const customKeys = Object.keys(claims.custom);
    const hasReserved = customKeys.some((key) =>
      reservedKeys.includes(key)
    );
    if (hasReserved) {
      throw new RangeError(
        "custom claims must not use reserved keys: sub, iss, aud, iat, exp"
      );
    }
  }

  // Calculate iat and exp
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

  if (claims.custom) {
    Object.assign(payload, claims.custom);
  }

  return payload;
}

export { buildJwtPayload };