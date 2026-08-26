// bloom-deps:

export function validateEnvName(value: unknown): string {
  if (typeof value !== "string") {
    throw new TypeError("Expected a string");
  }

  const trimmed = value.trim();

  if (trimmed.length === 0) {
    throw new SyntaxError("Environment name must not be empty");
  }

  if (!/^[a-z0-9-]+$/.test(trimmed)) {
    throw new SyntaxError("Environment name must contain only lowercase alphanumerics and hyphens");
  }

  if (trimmed.startsWith("-") || trimmed.endsWith("-")) {
    throw new SyntaxError("Environment name must not start or end with a hyphen");
  }

  if (trimmed.includes("--")) {
    throw new SyntaxError("Environment name must not contain consecutive hyphens");
  }

  if (trimmed.length < 2 || trimmed.length > 40) {
    throw new RangeError("Environment name must be 2-40 characters");
  }

  return trimmed;
}