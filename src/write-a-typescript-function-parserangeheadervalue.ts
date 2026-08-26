// bloom-deps:

export function parseRangeHeader(value: unknown, fileSize: unknown): Array<{ start: number; end: number }> {
  // Validate value
  if (typeof value !== 'string') {
    throw new TypeError('value must be a string');
  }

  // Validate fileSize
  if (
    typeof fileSize !== 'number' ||
    !Number.isFinite(fileSize) ||
    !Number.isInteger(fileSize) ||
    fileSize <= 0
  ) {
    throw new TypeError('fileSize must be a finite positive integer');
  }

  // Check bytes= prefix
  if (!value.startsWith('bytes=')) {
    throw new SyntaxError("Range header must start with 'bytes='");
  }

  const rangeSpec = value.slice('bytes='.length);

  // Split by comma to get individual range specifiers
  const specifiers = rangeSpec.split(',');

  if (specifiers.length === 0) {
    throw new SyntaxError('Invalid Range header');
  }

  const ranges: Array<{ start: number; end: number }> = [];

  for (const specifier of specifiers) {
    const trimmed = specifier.trim();

    if (trimmed === '') {
      throw new SyntaxError('Invalid Range header');
    }

    // Check if it's a suffix range (starts with -)
    if (trimmed.startsWith('-')) {
      // Suffix range: -N
      const suffixStr = trimmed.slice(1);
      if (suffixStr === '' || !/^\d+$/.test(suffixStr)) {
        throw new SyntaxError('Invalid Range header');
      }
      const suffixLen = parseInt(suffixStr, 10);

      // Resolve suffix range: last N bytes
      let start = fileSize - suffixLen;
      let end = fileSize - 1;

      // Clamp
      if (start < 0) start = 0;
      if (end > fileSize - 1) end = fileSize - 1;

      // Compute feedback before applying force-zero score rules
      const isSatisfiable = start <= end && start < fileSize;

      if (!isSatisfiable) {
        throw new RangeError('Range not satisfiable');
      }

      ranges.push({ start, end });
    } else {
      // Regular range: start-end or start-
      const dashIndex = trimmed.indexOf('-');
      if (dashIndex === -1) {
        throw new SyntaxError('Invalid Range header');
      }

      const startStr = trimmed.slice(0, dashIndex);
      const endStr = trimmed.slice(dashIndex + 1);

      if (startStr === '') {
        // No start but doesn't start with '-' handled above — this is malformed
        throw new SyntaxError('Invalid Range header');
      }

      if (!/^\d+$/.test(startStr)) {
        throw new SyntaxError('Invalid Range header');
      }

      const rawStart = parseInt(startStr, 10);

      let start: number;
      let end: number;

      if (endStr === '') {
        // Open-ended range: start-
        start = rawStart;
        end = fileSize - 1;
      } else {
        if (!/^\d+$/.test(endStr)) {
          throw new SyntaxError('Invalid Range header');
        }
        const rawEnd = parseInt(endStr, 10);

        // Check if start > end before clamping for explicit ranges
        if (rawStart > rawEnd) {
          throw new RangeError('Range not satisfiable');
        }

        start = rawStart;
        end = rawEnd;
      }

      // Clamp to [0, fileSize-1]
      if (start < 0) start = 0;
      if (end > fileSize - 1) end = fileSize - 1;

      // Compute feedback independently before applying force-zero score rules
      const isSatisfiable = start <= end && start < fileSize;

      if (!isSatisfiable) {
        throw new RangeError('Range not satisfiable');
      }

      ranges.push({ start, end });
    }
  }

  // Sort ranges by start
  ranges.sort((a, b) => a.start - b.start || a.end - b.end);

  // Merge overlapping/adjacent ranges
  const merged: Array<{ start: number; end: number }> = [];

  for (const range of ranges) {
    if (merged.length === 0) {
      merged.push({ ...range });
    } else {
      const last = merged[merged.length - 1];
      if (range.start <= last.end + 1) {
        // Overlapping or adjacent — merge
        if (range.end > last.end) {
          last.end = range.end;
        }
      } else {
        merged.push({ ...range });
      }
    }
  }

  return merged;
}