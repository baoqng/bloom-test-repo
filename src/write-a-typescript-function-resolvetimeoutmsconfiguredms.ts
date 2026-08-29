// bloom-deps:

export function resolveTimeoutMs(
  configuredMs: number | null | undefined,
  defaultMs: number,
  maxMs: number
): number {
  // Validate defaultMs
  if (!Number.isFinite(defaultMs)) {
    throw new TypeError('defaultMs must be a finite number');
  }
  if (defaultMs <= 0) {
    throw new RangeError('defaultMs must be > 0');
  }

  // Validate maxMs
  if (!Number.isFinite(maxMs)) {
    throw new TypeError('maxMs must be a finite number');
  }
  if (maxMs < defaultMs) {
    throw new RangeError('maxMs must be >= defaultMs');
  }

  // Handle null or undefined configuredMs
  if (configuredMs === null || configuredMs === undefined) {
    return Math.min(defaultMs, maxMs);
  }

  // Validate configuredMs
  if (!Number.isFinite(configuredMs)) {
    throw new TypeError('configuredMs must be a finite number');
  }
  if (configuredMs <= 0) {
    throw new RangeError('configuredMs must be > 0');
  }

  // Cap to maxMs if exceeded, otherwise return configuredMs
  if (configuredMs > maxMs) {
    return maxMs;
  }

  return configuredMs;
}