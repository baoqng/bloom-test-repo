// bloom-deps:

function parseHexString(value: unknown): number {
  if (typeof value !== "string") {
    throw new TypeError("Expected a string");
  }

  const trimmed = value.trim();

  if (trimmed.length === 0) {
    throw new SyntaxError("String must not be empty");
  }

  let hex = trimmed;

  if (hex.startsWith("0x") || hex.startsWith("0X")) {
    hex = hex.slice(2);
  }

  if (hex.length === 0) {
    throw new SyntaxError("No hex digits found");
  }

  if (!/^[0-9A-Fa-f]+$/.test(hex)) {
    throw new SyntaxError("Invalid hex character");
  }

  const result = parseInt(hex, 16);

  if (result > Number.MAX_SAFE_INTEGER) {
    throw new RangeError("Value exceeds safe integer range");
  }

  return result;
}

export { parseHexString };