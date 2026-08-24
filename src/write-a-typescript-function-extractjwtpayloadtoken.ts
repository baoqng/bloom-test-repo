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
  // Replace base64url characters with standard base64
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  
  // Pad with '=' to make length a multiple of 4
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
  
  // Decode from base64 to utf8
  return Buffer.from(padded, 'base64').toString('utf8');
}

export function extractJWTPayload(token: unknown): Record<string, unknown> {
  // Validate token is a non-empty string
  if (typeof token !== 'string') {
    throw new TypeError('Token must be a non-empty string');
  }
  
  if (token.length === 0 || token.trim().length === 0) {
    throw new TypeError('Token must be a non-empty string');
  }
  
  // Split by periods and validate exactly 3 parts
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new SyntaxError('Token must consist of exactly three period-separated parts');
  }
  
  const [headerPart, payloadPart, signaturePart] = parts;
  
  // Validate header is valid base64url-encoded JSON
  try {
    const headerStr = base64urlDecode(headerPart);
    const header = JSON.parse(headerStr);
    // Just validate it's an object, we don't care about specific claims
    if (typeof header !== 'object' || header === null || Array.isArray(header)) {
      throw new SyntaxError('Header must be a valid JSON object');
    }
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw error;
    }
    throw new SyntaxError('Header is not valid base64url-encoded JSON');
  }
  
  // Decode payload from base64url
  let payloadStr: string;
  try {
    payloadStr = base64urlDecode(payloadPart);
  } catch (error) {
    throw new SyntaxError('Payload is not valid base64url encoding');
  }
  
  // Validate decoded payload is valid JSON
  let payload: unknown;
  try {
    payload = JSON.parse(payloadStr);
  } catch (error) {
    throw new SyntaxError('Payload is not valid JSON');
  }
  
  // Validate parsed payload is a plain object (not array, string, number, null, etc.)
  if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
    throw new SyntaxError('Payload must be a plain object');
  }
  
  return payload as Record<string, unknown>;
}