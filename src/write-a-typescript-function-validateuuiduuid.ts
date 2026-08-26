// bloom-deps:

export function validateUuid(uuid: unknown): string {
  if (typeof uuid !== "string") {
    throw new TypeError("uuid must be a string");
  }

  if (uuid.trim() === "") {
    throw new RangeError("uuid must not be empty");
  }

  const normalized = uuid.trim().toLowerCase();

  if (normalized.length !== 36) {
    throw new RangeError("uuid must be exactly 36 characters");
  }

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
  if (!uuidRegex.test(normalized)) {
    throw new RangeError("uuid must match format xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx");
  }

  if (normalized[14] !== "4") {
    throw new RangeError("uuid version must be 4");
  }

  if (!["8", "9", "a", "b"].includes(normalized[19])) {
    throw new RangeError("uuid variant must be 8, 9, a, or b");
  }

  return normalized;
}