// bloom-deps:

export function resolveEffectiveTimeout(
  requestMs: number | null | undefined,
  serviceMs: number,
  absoluteMaxMs: number
): number {
  // Validate serviceMs
  if (typeof serviceMs !== 'number' || !isFinite(serviceMs) || serviceMs <= 0) {
    throw new TypeError('serviceMs must be a positive finite number');
  }

  // Validate absoluteMaxMs: must be positive finite and >= serviceMs
  if (typeof absoluteMaxMs !== 'number' || !isFinite(absoluteMaxMs) || absoluteMaxMs <= 0 || absoluteMaxMs < serviceMs) {
    throw new TypeError('absoluteMaxMs must be >= serviceMs');
  }

  // Resolve: use requestMs if valid positive finite number, otherwise fall back to serviceMs
  let resolved: number;
  if (
    requestMs !== null &&
    requestMs !== undefined &&
    typeof requestMs === 'number' &&
    isFinite(requestMs) &&
    requestMs > 0
  ) {
    resolved = requestMs;
  } else {
    resolved = serviceMs;
  }

  // Clamp to absoluteMaxMs
  if (resolved > absoluteMaxMs) {
    return absoluteMaxMs;
  }

  return resolved;
}