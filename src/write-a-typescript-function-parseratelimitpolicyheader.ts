// bloom-deps:

export function parseRateLimitPolicy(header: unknown): { limit: number; windowSecs: number } {
  if (typeof header !== 'string') {
    throw new TypeError('header must be a string');
  }

  const delimIndex = header.indexOf(';');
  if (delimIndex === -1) {
    throw new TypeError('header does not match expected format "limit=N; w=N"');
  }

  const limitPart = header.slice(0, delimIndex).trim();
  const wPart = header.slice(delimIndex + 1).trim();

  const limitMatch = limitPart.match(/^\s*limit\s*=\s*(\d+)\s*$/);
  if (!limitMatch) {
    throw new TypeError('header does not match expected format "limit=N; w=N"');
  }

  const wMatch = wPart.match(/^\s*w\s*=\s*(\d+)\s*$/);
  if (!wMatch) {
    throw new TypeError('header does not match expected format "limit=N; w=N"');
  }

  const limit = parseInt(limitMatch[1], 10);
  const windowSecs = parseInt(wMatch[1], 10);

  if (limit < 1) {
    throw new RangeError('limit must be at least 1');
  }

  if (windowSecs < 1) {
    throw new RangeError('windowSecs must be at least 1');
  }

  return { limit, windowSecs };
}