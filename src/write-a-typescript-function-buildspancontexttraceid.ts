// bloom-deps:

export function buildSpanContext(traceId: unknown, spanId: unknown, traceFlags: unknown): string {
  if (typeof traceId !== 'string') {
    throw new TypeError('traceId must be a string');
  }
  if (traceId.length !== 32 || !/^[0-9a-f]{32}$/.test(traceId)) {
    throw new RangeError('traceId must be exactly 32 lowercase hex characters');
  }
  if (traceId === '00000000000000000000000000000000') {
    throw new RangeError('traceId must not be all zeros');
  }

  if (typeof spanId !== 'string') {
    throw new TypeError('spanId must be a string');
  }
  if (spanId.length !== 16 || !/^[0-9a-f]{16}$/.test(spanId)) {
    throw new RangeError('spanId must be exactly 16 lowercase hex characters');
  }
  if (spanId === '0000000000000000') {
    throw new RangeError('spanId must not be all zeros');
  }

  if (
    typeof traceFlags !== 'number' ||
    !isFinite(traceFlags) ||
    !Number.isInteger(traceFlags) ||
    traceFlags < 0
  ) {
    throw new TypeError('traceFlags must be a non-negative integer');
  }
  if (traceFlags > 255) {
    throw new RangeError('traceFlags must be between 0 and 255');
  }

  const flags = traceFlags.toString(16).padStart(2, '0');
  return `00-${traceId}-${spanId}-${flags}`;
}