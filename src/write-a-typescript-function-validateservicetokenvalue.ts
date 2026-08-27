// bloom-deps:

export function validateServiceToken(value: unknown): void {
  if (typeof value !== "string") {
    throw new TypeError("value must be a string");
  }

  const normalized = value.trim();

  if (normalized.length < 20) {
    throw new RangeError("token too short");
  }

  if (normalized.length > 128) {
    throw new RangeError("token too long");
  }

  if (!normalized.startsWith("svc_")) {
    throw new SyntaxError("invalid prefix");
  }

  const afterPrefix = normalized.slice(4);

  if (/[^a-z0-9_]/.test(afterPrefix)) {
    throw new SyntaxError("invalid characters");
  }
}