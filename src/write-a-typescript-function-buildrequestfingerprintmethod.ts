// bloom-deps:

function isPlainObject(value: unknown): boolean {
  if (typeof value !== "object" || value === null) return false;
  if (Array.isArray(value)) return false;
  let proto = Object.getPrototypeOf(value);
  if (proto === null || proto === Object.prototype) return true;
  while (proto !== null) {
    if (
      proto.constructor !== undefined &&
      typeof proto.constructor === "function" &&
      proto.constructor !== Object
    ) {
      return false;
    }
    proto = Object.getPrototypeOf(proto);
  }
  return true;
}

export function buildRequestFingerprint(
  method: unknown,
  path: unknown,
  queryParams: unknown,
  clientIp: unknown
): string {
  // Validate method
  if (typeof method !== "string" || method.trim().length === 0) {
    throw new TypeError("method must be a non-empty string");
  }

  // Validate path
  if (typeof path !== "string" || path.trim().length === 0) {
    throw new TypeError("path must be a non-empty string");
  }

  // Validate queryParams
  if (queryParams !== null) {
    if (
      typeof queryParams !== "object" ||
      Array.isArray(queryParams) ||
      !isPlainObject(queryParams)
    ) {
      throw new TypeError("queryParams must be a plain object or null");
    }
  }

  // Validate clientIp
  if (typeof clientIp !== "string" || clientIp.trim().length === 0) {
    throw new TypeError("clientIp must be a non-empty string");
  }

  // Normalize
  const normalizedMethod = method.trim().toUpperCase();
  const trimmedPath = path.trim();
  const trimmedClientIp = clientIp.trim();

  // Build query string
  let queryString = "";
  if (queryParams !== null) {
    const obj = queryParams as Record<string, unknown>;
    const keys = Object.keys(obj).sort();
    if (keys.length > 0) {
      queryString = keys
        .map((key) => `${key}=${String(obj[key])}`)
        .join("&");
    }
  }

  return `${normalizedMethod}:${trimmedPath}?${queryString}@${trimmedClientIp}`;
}