// bloom-deps:

function parseFlagSet(value: unknown, allowed: unknown): Set<string> {
  if (typeof value !== "string") {
    throw new TypeError("value must be a string");
  }

  if (
    !Array.isArray(allowed) ||
    allowed.length === 0 ||
    !allowed.every((item) => typeof item === "string")
  ) {
    throw new TypeError("allowed must be a non-empty array of strings");
  }

  const allowedArray = allowed as string[];

  const trimmed = value.trim();
  if (trimmed === "") {
    return new Set<string>();
  }

  const tokens = value.split(",").map((t) => t.trim());

  const seen = new Set<string>();
  const result = new Set<string>();

  for (const token of tokens) {
    if (token === "") {
      throw new SyntaxError("Empty flag in input");
    }

    if (!allowedArray.includes(token)) {
      throw new SyntaxError(`Unknown flag: ${token}`);
    }

    if (seen.has(token)) {
      throw new SyntaxError(`Duplicate flag: ${token}`);
    }

    seen.add(token);
    result.add(token);
  }

  return result;
}

export { parseFlagSet };