// bloom-deps:

function parseTraceContext(header: unknown): { version: string; traceId: string; spanId: string; flags: number } {
  // Validate input type and non-emptiness
  if (typeof header !== 'string') {
    throw new TypeError('header must be a non-empty string');
  }
  
  if (header.length === 0) {
    throw new TypeError('header must be a non-empty string');
  }
  
  // Split by hyphen
  const parts = header.split('-');
  
  // Must have exactly 4 parts
  if (parts.length !== 4) {
    throw new SyntaxError('header must match format <version>-<traceId>-<spanId>-<flags>');
  }
  
  const [versionPart, traceIdPart, spanIdPart, flagsPart] = parts;
  
  // Validate version: exactly 2 lowercase hex digits
  if (!/^[0-9a-f]{2}$/.test(versionPart)) {
    throw new SyntaxError('version must be exactly 2 lowercase hex digits');
  }
  
  // Check if version is reserved 'ff'
  if (versionPart === 'ff') {
    throw new RangeError('version ff is reserved');
  }
  
  // Validate traceId: exactly 32 lowercase hex digits
  if (!/^[0-9a-f]{32}$/.test(traceIdPart)) {
    throw new RangeError('traceId must be exactly 32 lowercase hex digits');
  }
  
  // Check if traceId is all zeros
  if (traceIdPart === '0'.repeat(32)) {
    throw new RangeError('traceId must not be all zeros');
  }
  
  // Validate spanId: exactly 16 lowercase hex digits
  if (!/^[0-9a-f]{16}$/.test(spanIdPart)) {
    throw new RangeError('spanId must be exactly 16 lowercase hex digits');
  }
  
  // Check if spanId is all zeros
  if (spanIdPart === '0'.repeat(16)) {
    throw new RangeError('spanId must not be all zeros');
  }
  
  // Validate flags: exactly 2 lowercase hex digits
  if (!/^[0-9a-f]{2}$/.test(flagsPart)) {
    throw new SyntaxError('flags must be exactly 2 lowercase hex digits');
  }
  
  // Parse flags as base-16 integer
  const flagsValue = parseInt(flagsPart, 16);
  
  return {
    version: versionPart,
    traceId: traceIdPart,
    spanId: spanIdPart,
    flags: flagsValue
  };
}

export { parseTraceContext };