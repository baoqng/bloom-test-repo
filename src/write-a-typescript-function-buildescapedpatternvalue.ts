// bloom-deps:

function buildEscapedPattern(value: unknown): string {
  if (typeof value !== "string") {
    throw new TypeError("Expected a string");
  }

  if (value === "") {
    return "";
  }

  return value.replace(/[.*+?^${}[\]|()\\/\-]/g, "\\$&");
}

export { buildEscapedPattern };