// bloom-deps:

function parsePageCursor(value: unknown): { id: string; ts: number; dir: 'next' | 'prev' } {
  if (typeof value !== 'string') {
    throw new TypeError('Expected a string');
  }

  if (!/^[A-Za-z0-9_-]*$/.test(value)) {
    throw new SyntaxError('Invalid base64url cursor');
  }

  // Convert base64url to standard base64
  let base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  // Add padding
  const padLen = (4 - (base64.length % 4)) % 4;
  base64 += '='.repeat(padLen);

  let decoded: string;
  try {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    decoded = new TextDecoder('utf-8').decode(bytes);
  } catch {
    throw new SyntaxError('Invalid base64url cursor');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(decoded);
  } catch {
    throw new SyntaxError('Cursor is not valid JSON');
  }

  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    Array.isArray(parsed)
  ) {
    throw new SyntaxError('Cursor must be an object');
  }

  const obj = parsed as Record<string, unknown>;

  if (typeof obj['id'] !== 'string' || obj['id'].length === 0) {
    throw new SyntaxError('Cursor missing required field: id');
  }

  if (
    typeof obj['ts'] !== 'number' ||
    !Number.isInteger(obj['ts']) ||
    obj['ts'] < 0
  ) {
    throw new SyntaxError('Cursor missing required field: ts');
  }

  if (obj['dir'] !== 'next' && obj['dir'] !== 'prev') {
    throw new SyntaxError('Cursor missing required field: dir');
  }

  return {
    id: obj['id'] as string,
    ts: obj['ts'] as number,
    dir: obj['dir'] as 'next' | 'prev',
  };
}

export { parsePageCursor };