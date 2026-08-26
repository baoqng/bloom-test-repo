// bloom-deps:

function validateDomainName(domain: unknown): string {
  if (typeof domain !== "string") {
    throw new TypeError("domain must be a string");
  }

  if (!domain.trim()) {
    throw new RangeError("domain must not be empty");
  }

  const normalized = domain.trim().toLowerCase();

  if (normalized.length > 253) {
    throw new RangeError("domain must not exceed 253 characters");
  }

  if (!normalized.includes(".")) {
    throw new RangeError("domain must contain at least one dot");
  }

  const labels = normalized.split(".");

  for (const label of labels) {
    if (label.length < 1 || label.length > 63) {
      throw new RangeError("each label must be between 1 and 63 characters");
    }
  }

  for (const label of labels) {
    if (!/^[a-z0-9-]+$/.test(label)) {
      throw new RangeError("labels must contain only letters, digits, and hyphens");
    }
  }

  for (const label of labels) {
    if (label.startsWith("-") || label.endsWith("-")) {
      throw new RangeError("labels must not start or end with a hyphen");
    }
  }

  const tld = labels[labels.length - 1];
  if (!/[a-z]/.test(tld)) {
    throw new RangeError("top-level domain must contain at least one letter");
  }

  return normalized;
}

export { validateDomainName };