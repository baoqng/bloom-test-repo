// bloom-deps:

export function buildThrottleKey(
  consumerId: unknown,
  resource: unknown,
  windowStartMs: unknown,
  windowSizeMs: unknown
): string {
  if (typeof consumerId !== 'string' || consumerId.trim().length === 0) {
    throw new TypeError('consumerId must be a non-empty string');
  }

  if (typeof resource !== 'string' || resource.trim().length === 0) {
    throw new TypeError('resource must be a non-empty string');
  }

  if (
    typeof windowStartMs !== 'number' ||
    !Number.isFinite(windowStartMs) ||
    !Number.isInteger(windowStartMs) ||
    windowStartMs < 0
  ) {
    throw new TypeError('windowStartMs must be a non-negative integer');
  }

  if (
    typeof windowSizeMs !== 'number' ||
    !Number.isFinite(windowSizeMs) ||
    !Number.isInteger(windowSizeMs) ||
    windowSizeMs <= 0
  ) {
    throw new TypeError('windowSizeMs must be a positive integer');
  }

  const trimmedConsumerId = consumerId.trim();
  const trimmedResource = resource.trim();
  const windowBucket = Math.floor(windowStartMs / windowSizeMs);

  return `${trimmedConsumerId}:${trimmedResource}:${windowBucket}`;
}