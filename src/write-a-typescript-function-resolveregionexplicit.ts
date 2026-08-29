// bloom-deps:

export function resolveRegion(
  explicit: string | null | undefined,
  envVar: string | null | undefined,
  defaultRegion: string
): string {
  if (typeof defaultRegion !== 'string' || defaultRegion.trim().length === 0) {
    throw new TypeError('defaultRegion must be a non-empty string');
  }

  if (explicit !== null && explicit !== undefined && typeof explicit === 'string' && explicit.trim().length > 0) {
    return explicit.trim();
  }

  if (envVar !== null && envVar !== undefined && typeof envVar === 'string' && envVar.trim().length > 0) {
    return envVar.trim();
  }

  return defaultRegion.trim();
}