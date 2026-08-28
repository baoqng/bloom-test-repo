// bloom-deps:

export function buildIdempotencyKey(
  userId: unknown,
  method: unknown,
  path: unknown,
  timestampMs: unknown
): string {
  if (typeof userId !== "string" || userId.trim() === "") {
    throw new TypeError("userId must be a non-empty string");
  }

  if (typeof method !== "string" || method.trim() === "") {
    throw new TypeError("method must be a non-empty string");
  }

  if (typeof path !== "string" || path.trim() === "") {
    throw new TypeError("path must be a non-empty string");
  }

  if (
    typeof timestampMs !== "number" ||
    !Number.isFinite(timestampMs) ||
    !Number.isInteger(timestampMs) ||
    timestampMs < 0
  ) {
    throw new TypeError("timestampMs must be a non-negative integer");
  }

  const trimmedUserId = userId.trim();
  const uppercaseMethod = method.trim().toUpperCase();
  const trimmedPath = path.trim();

  return `${trimmedUserId}:${uppercaseMethod}:${trimmedPath}:${timestampMs}`;
}