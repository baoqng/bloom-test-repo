// bloom-deps:

import * as crypto from "crypto";

interface IdTokenClaims {
  sub: string;
  email: string | null;
  name: string | null;
  iss: string;
  aud: string | string[];
  exp: number;
  iat: number;
}

function base64urlDecode(str: string): string {
  let padded = str;
  const remainder = str.length % 4;
  if (remainder === 1) {
    throw new SyntaxError("JWT payload is not valid base64url JSON");
  }
  if (remainder === 2) {
    padded = str + "==";
  } else if (remainder === 3) {
    padded = str + "=";
  }

  const buffer = Buffer.from(padded, "base64");
  return buffer.toString("utf-8");
}

function parseIdToken(token: unknown): IdTokenClaims {
  if (typeof token !== "string" || token.length === 0) {
    throw new TypeError("token must be a non-empty string");
  }

  const dotIndex = token.indexOf(".");
  if (dotIndex === -1) {
    throw new SyntaxError("JWT must have three dot-separated parts");
  }

  const secondDotIndex = token.indexOf(".", dotIndex + 1);
  if (secondDotIndex === -1) {
    throw new SyntaxError("JWT must have three dot-separated parts");
  }

  const thirdDotIndex = token.indexOf(".", secondDotIndex + 1);
  if (thirdDotIndex !== -1) {
    throw new SyntaxError("JWT must have three dot-separated parts");
  }

  const payload = token.slice(dotIndex + 1, secondDotIndex);

  let payloadJson: unknown;
  try {
    const decoded = base64urlDecode(payload);
    payloadJson = JSON.parse(decoded);
  } catch {
    throw new SyntaxError("JWT payload is not valid base64url JSON");
  }

  if (
    payloadJson === null ||
    typeof payloadJson !== "object" ||
    Array.isArray(payloadJson)
  ) {
    throw new SyntaxError("JWT payload is not valid base64url JSON");
  }

  const claims = payloadJson as Record<string, unknown>;

  if (!("sub" in claims)) {
    throw new RangeError("Missing required claim: sub");
  }
  if (!("iss" in claims)) {
    throw new RangeError("Missing required claim: iss");
  }
  if (!("aud" in claims)) {
    throw new RangeError("Missing required claim: aud");
  }
  if (!("exp" in claims)) {
    throw new RangeError("Missing required claim: exp");
  }
  if (!("iat" in claims)) {
    throw new RangeError("Missing required claim: iat");
  }

  const sub = claims.sub;
  const iss = claims.iss;
  const aud = claims.aud;
  const exp = claims.exp;
  const iat = claims.iat;

  if (typeof sub !== "string") {
    throw new SyntaxError("JWT payload is not valid base64url JSON");
  }

  if (typeof iss !== "string") {
    throw new SyntaxError("JWT payload is not valid base64url JSON");
  }

  if (typeof exp !== "number") {
    throw new SyntaxError("JWT payload is not valid base64url JSON");
  }

  if (typeof iat !== "number") {
    throw new SyntaxError("JWT payload is not valid base64url JSON");
  }

  if (
    typeof aud !== "string" &&
    (!Array.isArray(aud) ||
      !aud.every((item) => typeof item === "string"))
  ) {
    throw new SyntaxError("JWT payload is not valid base64url JSON");
  }

  const now = Math.floor(Date.now() / 1000);
  if (exp < now) {
    throw new RangeError("JWT has expired");
  }

  const email = claims.email !== undefined ? (claims.email as string | null) : null;
  const name = claims.name !== undefined ? (claims.name as string | null) : null;

  return {
    sub,
    email: typeof email === "string" ? email : null,
    name: typeof name === "string" ? name : null,
    iss,
    aud,
    exp,
    iat,
  };
}

export { parseIdToken, IdTokenClaims };