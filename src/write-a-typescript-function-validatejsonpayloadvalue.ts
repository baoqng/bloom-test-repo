// bloom-deps:

function validateJsonPayload(value: unknown): Record<string, unknown> {
  if (typeof value !== "string") {
    throw new TypeError("Expected a string");
  }

  if (value.trim() === "") {
    throw new SyntaxError("JSON string must not be empty");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    throw new SyntaxError("Invalid JSON");
  }

  if (parsed === null || Array.isArray(parsed) || typeof parsed !== "object") {
    throw new TypeError("JSON must represent a plain object");
  }

  if (Object.keys(parsed).length === 0) {
    throw new RangeError("Object must not be empty");
  }

  return parsed as Record<string, unknown>;
}

export { validateJsonPayload };