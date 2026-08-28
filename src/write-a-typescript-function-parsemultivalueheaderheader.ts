// bloom-deps:

function parseMultiValueHeader(header: unknown): string[] {
  if (typeof header !== "string") {
    throw new TypeError("header must be a string");
  }

  if (!header.trim()) {
    return [];
  }

  const segments = header.split(",");
  const result: string[] = [];

  for (const segment of segments) {
    const trimmed = segment.trim();
    if (trimmed.length > 0) {
      result.push(trimmed);
    }
  }

  return result;
}

export { parseMultiValueHeader };