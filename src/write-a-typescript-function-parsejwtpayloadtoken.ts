// bloom-deps:

function parseJwtPayload(token: unknown): Record<string, unknown> {
  if (typeof token !== 'string' || token.length === 0) {
    throw new TypeError('token must be a non-empty string');
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('malformed JWT: expected three dot-separated parts');
  }

  const payloadB64 = parts[1];

  // Convert base64url to base64
  const base64 = payloadB64.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');

  let jsonString: string;
  try {
    jsonString = Buffer.from(padded, 'base64').toString('utf8');
  } catch {
    throw new Error('malformed JWT: payload is not valid JSON');
  }

  let payload: unknown;
  try {
    payload = JSON.parse(jsonString);
  } catch (error) {
    throw new Error('malformed JWT: payload is not valid JSON');
  }

  if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
    throw new Error('malformed JWT: payload is not valid JSON');
  }

  const payloadRecord = payload as Record<string, unknown>;

  if ('exp' in payloadRecord && typeof payloadRecord['exp'] === 'number') {
    const now = Math.floor(Date.now() / 1000);
    if (payloadRecord['exp'] < now) {
      throw new Error('JWT has expired');
    }
  }

  return payloadRecord;
}

export { parseJwtPayload };