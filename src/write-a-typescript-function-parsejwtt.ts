// bloom-deps:

export class ServiceError extends Error {
  constructor(message: string, options?: { cause?: Error }) {
    super(message);
    this.name = 'ServiceError';
    if (options?.cause) {
      this.cause = options.cause;
    }
  }
}

function base64urlDecode(str: string): string {
  const padded = str.padEnd(str.length + ((4 - (str.length % 4)) % 4), '=');
  const urlSafe = padded.replace(/-/g, '+').replace(/_/g, '/');
  try {
    return Buffer.from(urlSafe, 'base64').toString('utf8');
  } catch (error) {
    throw new SyntaxError('Invalid base64url encoding');
  }
}

export function parseJWT<T = Record<string, unknown>>(
  token: string
): {
  header: Record<string, unknown>;
  payload: T;
  raw: { header: string; payload: string; signature: string };
} {
  // Validate input type
  if (typeof token !== 'string') {
    throw new TypeError('token must be a string');
  }

  // Split on dots
  const parts = token.split('.');

  // Validate exactly three parts
  if (parts.length !== 3) {
    throw new SyntaxError('token must contain exactly three dot-separated parts');
  }

  const [headerB64url, payloadB64url, signatureB64url] = parts;

  let headerJson: string;
  let payloadJson: string;

  // Decode and parse header
  try {
    headerJson = base64urlDecode(headerB64url);
  } catch (error) {
    throw new SyntaxError('Invalid base64url-encoded header');
  }

  let header: Record<string, unknown>;
  try {
    header = JSON.parse(headerJson) as Record<string, unknown>;
  } catch (error) {
    throw new SyntaxError('header is not valid JSON');
  }

  // Decode and parse payload
  try {
    payloadJson = base64urlDecode(payloadB64url);
  } catch (error) {
    throw new SyntaxError('Invalid base64url-encoded payload');
  }

  let payload: T;
  try {
    payload = JSON.parse(payloadJson) as T;
  } catch (error) {
    throw new SyntaxError('payload is not valid JSON');
  }

  return {
    header,
    payload,
    raw: {
      header: headerB64url,
      payload: payloadB64url,
      signature: signatureB64url,
    },
  };
}