// bloom-deps:

export function parsePositiveInt(str: string): number {
  if (typeof str !== "string") {
    throw new TypeError("Input must be a string");
  }

  const trimmed = str.trim();

  if (trimmed === "") {
    throw new RangeError("Input string is empty or whitespace");
  }

  if (trimmed !== str) {
    throw new RangeError(
      `Parsed value is not a positive integer: "${str}"`
    );
  }

  if (!/^[0-9]+$/.test(trimmed)) {
    throw new RangeError(
      `Parsed value is not a positive integer: "${str}"`
    );
  }

  if (trimmed.length > 1 && trimmed[0] === '0') {
    throw new RangeError(
      `Parsed value is not a positive integer: "${str}"`
    );
  }

  const num = Number(trimmed);

  if (!Number.isFinite(num) || !Number.isInteger(num) || num <= 0) {
    throw new RangeError(
      `Parsed value is not a positive integer: "${str}"`
    );
  }

  return num;
}