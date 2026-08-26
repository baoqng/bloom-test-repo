// bloom-deps:

function validateDomainName(value: unknown): string {
  if (typeof value !== "string") {
    throw new TypeError("Expected a string");
  }

  let domain = value;

  // Strip trailing dot if present
  if (domain.endsWith(".")) {
    domain = domain.slice(0, -1);
  }

  // Check if empty after stripping
  if (domain.length === 0) {
    throw new SyntaxError("Domain must not be empty");
  }

  // Check domain length
  if (domain.length > 253) {
    throw new RangeError("Domain must not exceed 253 characters");
  }

  // Split on '.'
  const labels = domain.split(".");

  // Check at least two labels
  if (labels.length < 2) {
    throw new SyntaxError("Domain must have at least two labels");
  }

  // Validate each label
  for (const label of labels) {
    if (label.length === 0) {
      throw new SyntaxError(`Label '${label}' must not be empty`);
    }

    if (label.length > 63) {
      throw new RangeError(`Label '${label}' must not exceed 63 characters`);
    }

    if (!/^[A-Za-z0-9-]+$/.test(label)) {
      throw new SyntaxError(`Label '${label}' must contain only alphanumerics and hyphens`);
    }

    if (label.startsWith("-") || label.endsWith("-")) {
      throw new SyntaxError(`Label '${label}' must not start or end with a hyphen`);
    }
  }

  return domain.toLowerCase();
}

export { validateDomainName };