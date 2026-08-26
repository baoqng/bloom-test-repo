// bloom-deps:

function buildQueryParams(params: unknown): string {
  if (params === null || typeof params !== "object" || Array.isArray(params)) {
    throw new TypeError("params must be a plain object");
  }

  const record = params as Record<string, unknown>;
  const pairs: string[] = [];

  for (const key of Object.keys(record)) {
    const value = record[key];

    if (value === null || value === undefined) {
      continue;
    }

    if (typeof value !== "string" && typeof value !== "number" && typeof value !== "boolean") {
      throw new TypeError(`Value for '${key}' must be a string, number, or boolean`);
    }

    const encodedKey = encodeURIComponent(key);
    const encodedValue = encodeURIComponent(String(value));
    pairs.push(`${encodedKey}=${encodedValue}`);
  }

  return pairs.join("&");
}

export { buildQueryParams };