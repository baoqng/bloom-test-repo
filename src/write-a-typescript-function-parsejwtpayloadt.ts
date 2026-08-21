// bloom-deps:

function base64urlDecode(str: string): string {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  return Buffer.from(padded, 'base64').toString('utf8');
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  if (typeof v !== 'object' || v === null) return false;
  return Object.getPrototypeOf(v) === Object.prototype;
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

  let header: Record<string, unknown>;
  try {
    const headerJson = base64urlDecode(rawHeader);
    let parsed: unknown;
    try {
      parsed = JSON.parse(headerJson);
    } catch {
      throw new SyntaxError('Invalid JWT header: not valid base64url JSON');
    }
    if (!isPlainObject(parsed)) {
      throw new SyntaxError('Invalid JWT header: not valid base64url JSON');
    }
    header = parsed;
  } catch (e) {
    if (e instanceof SyntaxError) throw e;
    throw new SyntaxError('Invalid JWT header: not valid base64url JSON');
  }

  let payload: T;
  try {
    const payloadJson = base64urlDecode(rawPayload);
    let parsed: unknown;
    try {
      parsed = JSON.parse(payloadJson);
    } catch {
      throw new SyntaxError('Invalid JWT payload: not valid base64url JSON');
    }
    payload = parsed as T;
  } catch (e) {
    if (e instanceof SyntaxError) throw e;
    throw new SyntaxError('Invalid JWT payload: not valid base64url JSON');
  }

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