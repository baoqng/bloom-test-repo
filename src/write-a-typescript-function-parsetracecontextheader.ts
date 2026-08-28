// bloom-deps:

export function parseTraceContext(header: unknown): { version: string; traceId: string; spanId: string; flags: number } {
  if (typeof header !== 'string' || header.length === 0) {
    throw new TypeError('header must be a non-empty string');
  }

  // Split into exactly 4 parts using indexOf+slice to count delimiters explicitly
  let remaining = header;
  const parts: string[] = [];

  for (let i = 0; i < 3; i++) {
    const idx = remaining.indexOf('-');
    if (idx === -1) {
      throw new SyntaxError('header must have exactly 4 hyphen-delimited parts');
    }
    parts.push(remaining.slice(0, idx));
    remaining = remaining.slice(idx + 1);
  }
  parts.push(remaining);

  // Ensure there are no extra hyphens in the last part by checking part count
  if (parts.length !== 4) {
    throw new SyntaxError('header must have exactly 4 hyphen-delimited parts');
  }

  // Verify the last part has no more hyphens (extra parts check)
  if (remaining.indexOf('-') !== -1) {
    throw new SyntaxError('header must have exactly 4 hyphen-delimited parts');
  }

  const [versionStr, traceIdStr, spanIdStr, flagsStr] = parts;

  // Validate version: exactly 2 lowercase hex digits
  if (!/^[0-9a-f]{2}$/.test(versionStr)) {
    throw new SyntaxError('version must be exactly 2 lowercase hex digits');
  }

  // Check reserved version
  if (versionStr === 'ff') {
    throw new RangeError('version ff is reserved and must not be used');
  }

  // Validate traceId: exactly 32 lowercase hex digits
  if (!/^[0-9a-f]{32}$/.test(traceIdStr)) {
    throw new RangeError('traceId must be exactly 32 lowercase hex digits');
  }

  // traceId must not be all zeros
  if (traceIdStr === '0'.repeat(32)) {
    throw new RangeError('traceId must not be all zeros');
  }

  // Validate spanId: exactly 16 lowercase hex digits
  if (!/^[0-9a-f]{16}$/.test(spanIdStr)) {
    throw new RangeError('spanId must be exactly 16 lowercase hex digits');
  }

  // spanId must not be all zeros
  if (spanIdStr === '0'.repeat(16)) {
    throw new RangeError('spanId must not be all zeros');
  }

  // Validate flags: exactly 2 lowercase hex digits
  if (!/^[0-9a-f]{2}$/.test(flagsStr)) {
    throw new RangeError('flags must be exactly 2 lowercase hex digits');
  }

  const flags = parseInt(flagsStr, 16);

  return {
    version: versionStr,
    traceId: traceIdStr,
    spanId: spanIdStr,
    flags,
  };
}