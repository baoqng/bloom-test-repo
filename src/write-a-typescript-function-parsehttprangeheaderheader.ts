// bloom-deps:

function parseHttpRangeHeader(header: unknown, totalSize: unknown): Array<{ start: number; end: number }> {
  // Validate header
  if (typeof header !== 'string' || header.length === 0) {
    throw new TypeError('header must be a non-empty string');
  }

  // Validate totalSize
  if (
    typeof totalSize !== 'number' ||
    !Number.isInteger(totalSize) ||
    totalSize <= 0 ||
    !Number.isFinite(totalSize)
  ) {
    throw new TypeError('totalSize must be a positive integer');
  }

  const totalSizeNum = totalSize as number;

  // Check for 'bytes=' prefix
  const prefix = 'bytes=';
  if (!header.startsWith(prefix)) {
    throw new SyntaxError('Range unit must be bytes');
  }

  const rangeList = header.slice(prefix.length);

  if (rangeList.length === 0) {
    throw new SyntaxError('Invalid range syntax');
  }

  // Split by comma and parse each range
  const parts = rangeList.split(',');

  if (parts.length === 0) {
    throw new SyntaxError('Invalid range syntax');
  }

  const results: Array<{ start: number; end: number }> = [];
  let anyValidEntry = false;

  for (const part of parts) {
    const trimmed = part.trim();

    if (trimmed.length === 0) {
      // Skip empty parts but don't count them
      continue;
    }

    anyValidEntry = true;

    // Count '-' occurrences to validate syntax
    // Find the delimiter '-' - it must appear exactly once
    // but ranges like '-N' start with '-', so we need careful parsing

    // Check if it's a suffix range: starts with '-'
    if (trimmed.startsWith('-')) {
      // Suffix range: -N
      const suffixStr = trimmed.slice(1);
      if (suffixStr.length === 0) {
        throw new SyntaxError('Invalid range syntax');
      }
      if (!/^\d+$/.test(suffixStr)) {
        throw new SyntaxError('Invalid range syntax');
      }
      const N = parseInt(suffixStr, 10);
      if (N <= 0) {
        throw new RangeError('Unsatisfiable range');
      }
      const start = totalSizeNum - N;
      const end = totalSizeNum - 1;
      if (start > end || start >= totalSizeNum) {
        throw new RangeError('Unsatisfiable range');
      }
      results.push({ start, end });
    } else {
      // Could be 'N-M' or 'N-'
      // Find the '-' delimiter
      const dashIdx = trimmed.indexOf('-');
      if (dashIdx === -1) {
        throw new SyntaxError('Invalid range syntax');
      }

      const startStr = trimmed.slice(0, dashIdx);
      const endStr = trimmed.slice(dashIdx + 1);

      if (startStr.length === 0) {
        throw new SyntaxError('Invalid range syntax');
      }
      if (!/^\d+$/.test(startStr)) {
        throw new SyntaxError('Invalid range syntax');
      }

      const startNum = parseInt(startStr, 10);

      if (endStr.length === 0) {
        // Open-ended range: N-
        const end = totalSizeNum - 1;
        if (startNum > end || startNum >= totalSizeNum) {
          throw new RangeError('Unsatisfiable range');
        }
        results.push({ start: startNum, end });
      } else {
        // Absolute range: N-M
        if (!/^\d+$/.test(endStr)) {
          throw new SyntaxError('Invalid range syntax');
        }
        const endNum = parseInt(endStr, 10);
        if (startNum > endNum || startNum >= totalSizeNum) {
          throw new RangeError('Unsatisfiable range');
        }
        results.push({ start: startNum, end: endNum });
      }
    }
  }

  if (!anyValidEntry) {
    throw new SyntaxError('Invalid range syntax');
  }

  return results;
}

export { parseHttpRangeHeader };