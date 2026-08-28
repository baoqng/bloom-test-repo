// bloom-deps:

function parseQueryParam(url: unknown, name: unknown): string | null {
  if (typeof url !== "string" || url === "") {
    throw new TypeError("url must be a non-empty string");
  }
  if (typeof name !== "string" || name === "") {
    throw new TypeError("name must be a non-empty string");
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new RangeError("url must be a valid absolute URL");
  }

  const params = parsed.searchParams;
  const value = params.get(name);
  return value;
}

export { parseQueryParam };