// bloom-deps:

export function buildRequestFingerprint(
  method: unknown,
  path: unknown,
  queryParams: unknown,
  clientIp: unknown
): string {
  if (typeof method !== "string" || method.trim() === "") {
    throw new TypeError("method must be a non-empty string");
  }

  if (typeof path !== "string" || path.trim() === "") {
    throw new TypeError("path must be a non-empty string");
  }

  if (queryParams !== null) {
    if (
      typeof queryParams !== "object" ||
      Array.isArray(queryParams) ||
      Object.getPrototypeOf(queryParams) !== Object.prototype
    ) {
      throw new TypeError("queryParams must be a plain object or null");
    }
  }

  if (typeof clientIp !== "string" || clientIp.trim() === "") {
    throw new TypeError("clientIp must be a non-empty string");
  }

  const normalizedMethod = method.trim().toUpperCase();
  const trimmedPath = path.trim();
  const trimmedClientIp = clientIp.trim();

  let queryString = "";
  if (queryParams !== null) {
    const params = queryParams as Record<string, unknown>;
    const keys = Object.keys(params).sort();
    if (keys.length > 0) {
      queryString = keys.map((key) => `${key}=${String(params[key])}`).join("&");
    }
  }

  return `${normalizedMethod}:${trimmedPath}?${queryString}@${trimmedClientIp}`;
}