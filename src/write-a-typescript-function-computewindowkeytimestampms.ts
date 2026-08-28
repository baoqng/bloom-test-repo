// bloom-deps:

export function computeWindowKey(timestampMs: unknown, windowSizeMs: unknown, prefix: unknown): string {
  if (typeof timestampMs !== 'number') throw new TypeError('timestampMs must be a number');
  if (typeof windowSizeMs !== 'number') throw new TypeError('windowSizeMs must be a number');
  if (typeof prefix !== 'string') throw new TypeError('prefix must be a string');

  if (!isFinite(timestampMs)) throw new TypeError('timestampMs must be finite');
  if (!isFinite(windowSizeMs)) throw new TypeError('windowSizeMs must be finite');

  if (timestampMs < 0) throw new RangeError('timestampMs must be non-negative');
  if (windowSizeMs <= 0) throw new RangeError('windowSizeMs must be positive');
  if (prefix.trim().length === 0) throw new RangeError('prefix must not be empty');

  const bucket = Math.floor(timestampMs / windowSizeMs);
  return `${prefix.trim()}:${bucket}`;
}