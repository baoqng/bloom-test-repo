// bloom-deps:

function decodeBase64Url(str: string): string {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  return Buffer.from(padded, 'base64').toString('utf8');
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

export function parseJwtPayload<T = Record<string, unknown>>(
  token: unknown
): {
  header: Record<string, unknown>;
  payload: T;
  raw: { header: string; payload: string; signature: string };
} {
  if (typeof token !== 'string') {
    throw new TypeError('token must be a string');
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new SyntaxError('Invalid JWT: expected 3 dot-separated parts');
  }

  const [rawHeader, rawPayload, rawSignature] = parts;

  let headerJson: string;
  try {
    headerJson = decodeBase64Url(rawHeader);
  } catch {
    throw new SyntaxError('Invalid JWT header: not valid base64url JSON');
  }

  let headerParsed: unknown;
  try {
    headerParsed = JSON.parse(headerJson);
  } catch {
    throw new SyntaxError('Invalid JWT header: not valid base64url JSON');
  }

  if (!isPlainObject(headerParsed)) {
    throw new SyntaxError('Invalid JWT header: not valid base64url JSON');
  }

  const header: Record<string, unknown> = headerParsed;

  let payloadJson: string;
  try {
    payloadJson = decodeBase64Url(rawPayload);
  } catch {
    throw new SyntaxError('Invalid JWT payload: not valid base64url JSON');
  }

  let payloadParsed: unknown;
  try {
    payloadParsed = JSON.parse(payloadJson);
  } catch {
    throw new SyntaxError('Invalid JWT payload: not valid base64url JSON');
  }

  const payload = payloadParsed as T;

  return {
    header,
    payload,
    raw: {
      header: rawHeader,
      payload: rawPayload,
      signature: rawSignature,
    },
  };
}