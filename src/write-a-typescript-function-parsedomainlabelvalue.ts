// bloom-deps:

function parseDomainLabel(value: unknown): string {
  if (typeof value !== "string") {
    throw new TypeError("Expected a string");
  }

  if (value.length === 0) {
    throw new SyntaxError("Label must not be empty");
  }

  if (value.length > 63) {
    throw new RangeError("Label must not exceed 63 characters");
  }

  if (value[0] === "-" || value[value.length - 1] === "-") {
    throw new SyntaxError("Label must not start or end with a hyphen");
  }

  if (!/^[A-Za-z0-9-]+$/.test(value)) {
    throw new SyntaxError("Label must contain only alphanumerics and hyphens");
  }

  return value.toLowerCase();
}

export { parseDomainLabel };