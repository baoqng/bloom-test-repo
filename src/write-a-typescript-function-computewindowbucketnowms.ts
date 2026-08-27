// bloom-deps:

export function computeWindowBucket(nowMs: unknown, windowSizeMs: unknown, identifier: unknown): string {
  if (typeof nowMs !== 'number') {
    throw new TypeError('nowMs must be a number');
  }
  if (typeof windowSizeMs !== 'number') {
    throw new TypeError('windowSizeMs must be a number');
  }
  if (typeof identifier !== 'string') {
    throw new TypeError('identifier must be a string');
  }

  if (!Number.isFinite(nowMs) || !Number.isInteger(nowMs) || nowMs <= 0) {
    throw new RangeError('nowMs must be a positive finite integer');
  }
  if (!Number.isFinite(windowSizeMs) || !Number.isInteger(windowSizeMs) || windowSizeMs <= 0) {
    throw new RangeError('windowSizeMs must be a positive finite integer');
  }
  if (identifier.trim().length === 0) {
    throw new RangeError('identifier must not be empty');
  }

  const bucketStart = Math.floor(nowMs / windowSizeMs) * windowSizeMs;
  return identifier.trim() + ':' + bucketStart.toString();
}