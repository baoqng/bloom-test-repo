// bloom-deps:

function base64urlDecode(str: string): string {
  // Convert base64url to base64
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  // Pad with '=' to make length a multiple of 4
  const paddingNeeded = (4 - (base64.length % 4)) % 4;
  base64 += '='.repeat(paddingNeeded);

  // Decode base64 to a UTF-8 string
  const binaryStr = atob(base64);
  const bytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

export function parseJWT<T = Record<string, unknown>>(
  token: string
): {
  header: Record<string, unknown>;
  payload: T;
  raw: { header: string; payload: string; signature: string };
} {
  // Input type validation
  if (typeof token !== 'string') {
    throw new TypeError('token must be a string');
  }

  // Split on '.' and verify exactly three parts
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new SyntaxError(
      `JWT must contain exactly three dot-separated parts, got ${parts.length}`
    );
  }

  const [rawHeader, rawPayload, rawSignature] = parts;

  // Decode and parse header
  let header: Record<string, unknown>;
  try {
    const decodedHeader = base64urlDecode(rawHeader);
    const parsedHeader = JSON.parse(decodedHeader);
    if (
      typeof parsedHeader !== 'object' ||
      parsedHeader === null ||
      Array.isArray(parsedHeader)
    ) {
      throw new SyntaxError('JWT header must be a JSON object');
    }
    header = parsedHeader as Record<string, unknown>;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw error;
    }
    throw new SyntaxError(
      `JWT header is not valid base64url-encoded JSON: ${(error as Error).message}`
    );
  }

  // Decode and parse payload
  let payload: T;
  try {
    const decodedPayload = base64urlDecode(rawPayload);
    payload = JSON.parse(decodedPayload) as T;
  } catch (error) {
    if (error instanceof SyntaxError && (error as Error).message.startsWith('JWT payload')) {
      throw error;
    }
    throw new SyntaxError(
      `JWT payload is not valid base64url-encoded JSON: ${(error as Error).message}`
    );
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