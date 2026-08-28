// bloom-deps:

function buildWeakETag(contentHash: unknown, version: unknown): string {
  if (typeof contentHash !== "string" || contentHash.length === 0) {
    throw new TypeError("contentHash must be a non-empty string");
  }

  if (
    typeof version !== "number" ||
    !Number.isFinite(version) ||
    !Number.isInteger(version) ||
    version < 0
  ) {
    throw new TypeError("version must be a non-negative integer");
  }

  const normalized = contentHash.toLowerCase();

  if (/[^0-9a-f]/.test(normalized)) {
    throw new RangeError("contentHash must contain only hexadecimal characters");
  }

  return `W/"${normalized}-${version}"`;
}

export { buildWeakETag };