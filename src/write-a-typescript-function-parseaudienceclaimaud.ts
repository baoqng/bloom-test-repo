// bloom-deps:

export function parseAudienceClaim(aud: unknown): string[] {
  if (typeof aud !== "string" && !Array.isArray(aud)) {
    throw new RangeError("aud must be a string or array of strings");
  }

  if (typeof aud === "string") {
    if (aud.trim() === "") {
      if (aud.length === 0) {
        throw new RangeError("aud string must not be empty");
      } else {
        throw new RangeError("aud string must not be empty");
      }
    }
    return [aud.trim()];
  }

  // aud is an array
  if (aud.length === 0) {
    throw new RangeError("aud array must not be empty");
  }

  for (const entry of aud) {
    if (typeof entry !== "string" || entry.trim() === "") {
      throw new RangeError("each aud entry must be a non-empty string");
    }
  }

  const seen = new Set<string>();
  const result: string[] = [];
  for (const entry of aud as string[]) {
    const trimmed = entry.trim();
    if (!seen.has(trimmed)) {
      seen.add(trimmed);
      result.push(trimmed);
    }
  }

  return result;
}