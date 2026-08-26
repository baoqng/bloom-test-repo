// bloom-deps:

export function validateAssetPath(path: unknown): string {
  // Check type first
  if (typeof path !== "string") {
    throw new TypeError("path must be a string");
  }

  // Check for null bytes on original string before trimming
  if (path.includes("\x00")) {
    throw new RangeError("path must not contain null bytes");
  }

  // Check empty or whitespace-only
  const trimmed = path.trim();
  if (trimmed.length === 0) {
    throw new RangeError("path must not be empty");
  }

  // Check absolute path
  if (trimmed.startsWith("/") || /^[A-Za-z]:\\/.test(trimmed)) {
    throw new RangeError("path must not be absolute");
  }

  // Check directory traversal by splitting on both '/' and '\'
  const segments = trimmed.split(/[/\\]/);
  if (segments.some((segment) => segment === "..")) {
    throw new RangeError("path must not contain directory traversal sequences");
  }

  // Check for invalid characters
  if (/[^A-Za-z0-9\-_./\\]/.test(trimmed)) {
    throw new RangeError("path must contain only valid path characters");
  }

  return trimmed;
}