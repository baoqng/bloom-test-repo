export function parseRangeHeader(
  value: unknown,
  fileSize: unknown
): Array<{ start: number; end: number }> {
  // Validate value is a string
  if (typeof value !== "string") {
    throw new TypeError("value must be a string");
  }

  // Validate fileSize is a finite positive integer
  if (
    typeof fileSize !== "number" ||
    !Number.isInteger(fileSize) ||
    !Number.isFinite(fileSize) ||
    fileSize <= 0
  ) {
    throw new TypeError("fileSize must be a finite positive integer");
  }

  // Check for 'bytes=' prefix
  if (!value.startsWith("bytes=")) {
    throw new SyntaxError("Range header must start with 'bytes='");
  }

  // Extract the range specifiers
  const rangeString = value.slice(6);
  const specifiers = rangeString.split(",").map((s) => s.trim());

  const ranges: Array<{ start: number; end: number }> = [];

  for (const specifier of specifiers) {
    if (!specifier) {
      throw new SyntaxError("Invalid Range header");
    }

    let start: number;
    let end: number;

    if (specifier.startsWith("-")) {
      // Suffix range: e.g., "-500" means last 500 bytes
      const suffixLength = parseInt(specifier.slice(1), 10);
      if (isNaN(suffixLength) || suffixLength < 0 || !Number.isInteger(suffixLength)) {
        throw new SyntaxError("Invalid Range header");
      }

      start = Math.max(0, fileSize - suffixLength);
      end = fileSize - 1;
    } else {
      // Byte range: e.g., "0-499" or "500-"
      const parts = specifier.split("-");
      if (parts.length !== 2) {
        throw new SyntaxError("Invalid Range header");
      }

      const [startStr, endStr] = parts;

      if (!startStr) {
        throw new SyntaxError("Invalid Range header");
      }

      start = parseInt(startStr, 10);
      if (isNaN(start) || !Number.isInteger(start) || start < 0) {
        throw new SyntaxError("Invalid Range header");
      }

      if (endStr === "") {
        // Open-ended range: "500-" means 500 to end of file
        end = fileSize - 1;
      } else {
        end = parseInt(endStr, 10);
        if (isNaN(end) || !Number.isInteger(end) || end < 0) {
          throw new SyntaxError("Invalid Range header");
        }
      }

      // For non-suffix ranges, check if start >= fileSize before clamping
      if (start >= fileSize) {
        throw new RangeError("Range not satisfiable");
      }

      // Check if start > end (before clamping) for explicit ranges
      if (start > end) {
        throw new RangeError("Range not satisfiable");
      }
    }

    // Clamp range to [0, fileSize - 1]
    start = Math.max(0, Math.min(start, fileSize - 1));
    end = Math.max(0, Math.min(end, fileSize - 1));

    // Check if range is satisfiable
    if (start > end || start >= fileSize) {
      throw new RangeError("Range not satisfiable");
    }

    ranges.push({ start, end });
  }

  // Merge overlapping ranges
  if (ranges.length === 0) {
    return [];
  }

  // Sort ranges by start position
  ranges.sort((a, b) => a.start - b.start);

  const merged: Array<{ start: number; end: number }> = [];
  let current = ranges[0];

  for (let i = 1; i < ranges.length; i++) {
    const next = ranges[i];

    // Check if ranges overlap or are adjacent
    if (next.start <= current.end + 1) {
      // Merge overlapping ranges
      current.end = Math.max(current.end, next.end);
    } else {
      // No overlap, add current to merged and move to next
      merged.push(current);
      current = next;
    }
  }

  merged.push(current);

  return merged;
}