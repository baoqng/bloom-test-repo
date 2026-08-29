// bloom-deps:

import * as crypto from 'crypto';

interface IdTokenClaims {
  sub: string;
  email: string | null;
  name: string | null;
  iss: string;
  aud: string | string[];
  exp: number;
  iat: number;
}

function base64urlDecode(input: string): string {
  // Add padding if needed
  let padded = input;
  const remainder = input.length % 4;
  if (remainder > 0) {
    padded = input + '='.repeat(4 - remainder);
  }

  // Replace base64url characters with standard base64
  const standard = padded.replace(/-/g, '+').replace(/_/g, '/');

  // Decode using Buffer
  return Buffer.from(standard, 'base64').toString('utf8');
}

export function parseIdToken(token: unknown): IdTokenClaims {
  // Validate token is a non-empty string
  if (typeof token !== 'string' || token.length === 0) {
    throw new TypeError('token must be a non-empty string');
  }

  // Split into three parts
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new SyntaxError('JWT must have three dot-separated parts');
  }

  // Decode and parse payload
  let payload: Record<string, unknown>;
  try {
    const decodedPayload = base64urlDecode(parts[1]);
    payload = JSON.parse(decodedPayload);
  } catch {
    throw new SyntaxError('JWT payload is not valid base64url JSON');
  }

  // Validate payload is a plain object
  if (
    payload === null ||
    typeof payload !== 'object' ||
    Array.isArray(payload) ||
    Object.getPrototypeOf(payload) !== Object.prototype
  ) {
    throw new SyntaxError('JWT payload is not valid base64url JSON');
  }

  // Check for required claims
  if (!('sub' in payload)) {
    throw new RangeError('Missing required claim: sub');
  }
  if (!('iss' in payload)) {
    throw new RangeError('Missing required claim: iss');
  }
  if (!('aud' in payload)) {
    throw new RangeError('Missing required claim: aud');
  }
  if (!('exp' in payload)) {
    throw new RangeError('Missing required claim: exp');
  }
  if (!('iat' in payload)) {
    throw new RangeError('Missing required claim: iat');
  }

  // Extract and validate required claims
  const sub = payload.sub;
  const iss = payload.iss;
  const aud = payload.aud;
  const exp = payload.exp;
  const iat = payload.iat;

  // Type checks for required claims
  if (typeof sub !== 'string') {
    throw new SyntaxError('JWT payload is not valid base64url JSON');
  }
  if (typeof iss !== 'string') {
    throw new SyntaxError('JWT payload is not valid base64url JSON');
  }
  if (typeof exp !== 'number') {
    throw new SyntaxError('JWT payload is not valid base64url JSON');
  }
  if (typeof iat !== 'number') {
    throw new SyntaxError('JWT payload is not valid base64url JSON');
  }

  // Validate aud is string or array of strings
  if (typeof aud !== 'string' && !Array.isArray(aud)) {
    throw new SyntaxError('JWT payload is not valid base64url JSON');
  }
  if (Array.isArray(aud)) {
    if (!aud.every((a) => typeof a === 'string')) {
      throw new SyntaxError('JWT payload is not valid base64url JSON');
    }
  }

  // Check expiration
  const nowInSeconds = Math.floor(Date.now() / 1000);
  if (exp < nowInSeconds) {
    throw new RangeError('JWT has expired');
  }

  // Extract optional claims
  const email = typeof payload.email === 'string' ? payload.email : null;
  const name = typeof payload.name === 'string' ? payload.name : null;

  return {
    sub,
    email,
    name,
    iss,
    aud,
    exp,
    iat,
  };
}