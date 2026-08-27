// bloom-deps:

export function validateDomainName(domain: unknown): string {
  // (1) Type check
  if (typeof domain !== "string") {
    throw new TypeError("domain must be a string");
  }

  // (2) Empty/whitespace check
  if (!domain.trim()) {
    throw new RangeError("domain must not be empty");
  }

  // Trim and lowercase before further checks
  const normalized = domain.trim().toLowerCase();

  // (3) Length bounds
  if (normalized.length > 253) {
    throw new RangeError("domain must not exceed 253 characters");
  }

  // (4) Structural constraint: must contain at least one dot
  if (!normalized.includes(".")) {
    throw new RangeError("domain must contain at least one dot");
  }

  // (5) Split into labels and validate each
  const labels = normalized.split(".");

  for (const label of labels) {
    // Label length check
    if (label.length === 0 || label.length > 63) {
      throw new RangeError("each label must be between 1 and 63 characters");
    }

    // Character set check
    if (/[^a-z0-9-]/.test(label)) {
      throw new RangeError("labels must contain only letters, digits, and hyphens");
    }

    // Hyphen start/end check (per label, inside the loop)
    if (label.startsWith("-") || label.endsWith("-")) {
      throw new RangeError("labels must not start or end with a hyphen");
    }
  }

  // TLD must contain at least one letter
  const tld = labels[labels.length - 1];
  if (!/[a-z]/.test(tld)) {
    throw new RangeError("top-level domain must contain at least one letter");
  }

  return normalized;
}