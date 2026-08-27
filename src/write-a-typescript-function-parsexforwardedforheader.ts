// bloom-deps:

export function parseXForwardedFor(header: unknown): string[] {
  if (typeof header !== "string") {
    throw new TypeError("header must be a string");
  }

  if (!header.trim()) {
    throw new RangeError("header must not be empty");
  }

  const entries = header
    .split(",")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);

  if (entries.length === 0) {
    throw new RangeError("header contains no valid entries");
  }

  return entries;
}