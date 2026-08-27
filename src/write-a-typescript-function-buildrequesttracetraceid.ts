// bloom-deps:

function buildRequestTrace(traceId: unknown, spanId: unknown, sampled?: unknown): string {
  // Type validation for traceId
  if (typeof traceId !== 'string') {
    throw new TypeError('traceId must be a string');
  }

  // Type validation for spanId
  if (typeof spanId !== 'string') {
    throw new TypeError('spanId must be a string');
  }

  // Type validation for sampled if provided and not undefined
  if (sampled !== undefined && typeof sampled !== 'boolean') {
    throw new TypeError('sampled must be a boolean');
  }

  // Format validation for traceId: must be exactly 32 lowercase hex characters
  if (!/^[0-9a-f]{32}$/.test(traceId)) {
    throw new RangeError('traceId must be a 32-character lowercase hex string');
  }

  // All-zeros check for traceId
  if (traceId === '00000000000000000000000000000000') {
    throw new RangeError('traceId must not be all zeros');
  }

  // Format validation for spanId: must be exactly 16 lowercase hex characters
  if (!/^[0-9a-f]{16}$/.test(spanId)) {
    throw new RangeError('spanId must be a 16-character lowercase hex string');
  }

  // All-zeros check for spanId
  if (spanId === '0000000000000000') {
    throw new RangeError('spanId must not be all zeros');
  }

  // Determine trace flags: '01' if sampled is true or undefined, '00' if false
  const traceFlags = sampled === false ? '00' : '01';

  // Build and return the traceparent header value
  return `00-${traceId}-${spanId}-${traceFlags}`;
}

export { buildRequestTrace };