// bloom-deps:

function parseByteRange(input: unknown, unit: unknown): { start: number; end: number | null } {
  if (typeof input !== 'string' || input.length === 0) {
    throw new TypeError('input must be a non-empty string');
  }
  if (typeof unit !== 'string' || unit.length === 0) {
    throw new TypeError('unit must be a non-empty string');
  }

  const prefix = unit + '=';
  const prefixLen = prefix.length;

  // Check '=' in prefix slice(0, len-2)
  const prefixWithoutEq = prefix.slice(0, prefixLen - 1);
  if (prefixWithoutEq.indexOf('=') !== -1) {
    throw new SyntaxError('Range must start with UNIT=');
  }

  if (!input.startsWith(prefix)) {
    throw new SyntaxError('Range must start with UNIT=');
  }

  const rangePart = input.slice(prefixLen);

  // Count delimiter occurrences explicitly using indexOf+slice, not split
  // Must have exactly one '-' delimiter
  let dashCount = 0;
  let searchIdx = 0;
  while (true) {
    const found = rangePart.indexOf('-', searchIdx);
    if (found === -1) break;
    dashCount++;
    searchIdx = found + 1;
  }

  if (dashCount !== 1) {
    throw new SyntaxError('Invalid range format');
  }

  // Use indexOf+slice to split on first (and only) separator
  const dashIdx = rangePart.indexOf('-');
  const startStr = rangePart.slice(0, dashIdx);
  const endStr = rangePart.slice(dashIdx + 1);

  // Validate startStr: must be non-empty digits only
  if (startStr.length === 0 || !/^\d+$/.test(startStr)) {
    throw new SyntaxError('Invalid range format');
  }

  // endStr must be either empty (open-ended) or digits only
  if (endStr.length > 0 && !/^\d+$/.test(endStr)) {
    throw new SyntaxError('Invalid range format');
  }

  const start = Number(startStr);

  if (!Number.isInteger(start) || start < 0) {
    throw new RangeError('Start must be a non-negative integer');
  }

  if (endStr.length === 0) {
    return { start, end: null };
  }

  const end = Number(endStr);

  if (!Number.isInteger(end) || end < start) {
    throw new RangeError('End must be greater than or equal to start');
  }

  return { start, end };
}

export { parseByteRange };