// bloom-deps:
function parseStrictPercent(value: unknown): number {
  if (typeof value !== "string") {
    throw new TypeError("Expected a string");
  }

  if (!value.endsWith("%")) {
    throw new SyntaxError("Percentage string must end with '%'");
  }

  const numericPart = value.slice(0, -1);

  if (numericPart.length === 0 || isNaN(parseFloat(numericPart))) {
    throw new SyntaxError("Percentage value is not a valid number");
  }

  const parsed = parseFloat(numericPart);

  if (parsed < 0 || parsed > 100) {
    throw new RangeError("Percentage must be between 0 and 100");
  }

  return parsed;
}

export { parseStrictPercent };