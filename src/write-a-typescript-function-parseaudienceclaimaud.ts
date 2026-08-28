// bloom-deps:

export function parseAudienceClaim(aud: unknown): string[] {
  if (typeof aud === 'string') {
    if (aud.trim().length === 0) {
      throw new RangeError('aud string must not be empty');
    }
    return [aud.trim()];
  }

  if (!Array.isArray(aud)) {
    throw new RangeError('aud must be a string or array of strings');
  }

  if (aud.length === 0) {
    throw new RangeError('aud array must not be empty');
  }

  const seen = new Set<string>();
  const result: string[] = [];

  for (const entry of aud) {
    if (typeof entry !== 'string' || entry.trim().length === 0) {
      throw new RangeError('each aud entry must be a non-empty string');
    }
    const trimmed = entry.trim();
    if (!seen.has(trimmed)) {
      seen.add(trimmed);
      result.push(trimmed);
    }
  }

  return result;
}