// bloom-deps:

export function validateDomainName(domain: unknown): string {
  // Step 1: Type check
  if (typeof domain !== "string") {
    throw new TypeError("domain must be a string");
  }

  // Step 2: Empty/whitespace check
  if (!domain.trim()) {
    throw new RangeError("domain must not be empty");
  }

  // Trim and lowercase once before all further checks
  const normalized = domain.trim().toLowerCase();

  // Step 3: Length bounds check
  if (normalized.length > 253) {
    throw new RangeError("domain must not exceed 253 characters");
  }

  // Step 4: Structural constraints - check for at least one dot
  if (!normalized.includes(".")) {
    throw new RangeError("domain must contain at least one dot");
  }

  // Check for leading/trailing dots at domain level
  if (normalized.startsWith(".") || normalized.endsWith(".")) {
    throw new RangeError("domain must not start or end with a dot or hyphen");
  }

  // Step 5: Split and validate each label
  const labels = normalized.split(".");

  for (const label of labels) {
    // Check label length
    if (label.length < 1 || label.length > 63) {
      throw new RangeError("each label must be between 1 and 63 characters");
    }

    // Check label contains only letters, digits, and hyphens
    if (!/^[a-z0-9-]+$/.test(label)) {
      throw new RangeError(
        "labels must contain only letters, digits, and hyphens"
      );
    }

    // Check label does not start or end with hyphen
    if (label.startsWith("-") || label.endsWith("-")) {
      throw new RangeError("labels must not start or end with a hyphen");
    }
  }

  // Step 6: Validate top-level domain (last label) contains at least one letter
  const tld = labels[labels.length - 1];
  if (!/[a-z]/.test(tld)) {
    throw new RangeError("top-level domain must contain at least one letter");
  }

  return normalized;
}