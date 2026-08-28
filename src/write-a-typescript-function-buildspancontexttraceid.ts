// bloom-deps:

export function buildSpanContext(traceId: unknown, spanId: unknown, traceFlags: unknown): string {
  // Validate traceId type
  if (typeof traceId !== 'string') {
    throw new TypeError('traceId must be a string');
  }

  // Validate traceId format
  if (traceId.length !== 32 || !/^[0-9a-f]{32}$/.test(traceId)) {
    throw new RangeError('traceId must be exactly 32 lowercase hex characters');
  }

  // Validate traceId not all zeros
  if (traceId === '00000000000000000000000000000000') {
    throw new RangeError('traceId must not be all zeros');
  }

  // Validate spanId type
  if (typeof spanId !== 'string') {
    throw new TypeError('spanId must be a string');
  }

  // Validate spanId format
  if (spanId.length !== 16 || !/^[0-9a-f]{16}$/.test(spanId)) {
    throw new RangeError('spanId must be exactly 16 lowercase hex characters');
  }

  // Validate spanId not all zeros
  if (spanId === '0000000000000000') {
    throw new RangeError('spanId must not be all zeros');
  }

  // Validate traceFlags type
  if (
    typeof traceFlags !== 'number' ||
    !Number.isFinite(traceFlags) ||
    !Number.isInteger(traceFlags) ||
    traceFlags < 0
  ) {
    throw new TypeError('traceFlags must be a non-negative integer');
  }

  // Validate traceFlags range
  if (traceFlags > 255) {
    throw new RangeError('traceFlags must be between 0 and 255');
  }

  // Format traceFlags as 2-character lowercase hex string
  const flags = traceFlags.toString(16).padStart(2, '0');

  return `00-${traceId}-${spanId}-${flags}`;
}