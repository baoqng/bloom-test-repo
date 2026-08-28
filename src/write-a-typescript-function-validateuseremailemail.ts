// bloom-deps:

export function validateUserEmail(email: unknown): string {
  // Type check
  if (typeof email !== "string") {
    throw new TypeError("email must be a string");
  }

  // Empty/whitespace check
  if (!email.trim()) {
    throw new RangeError("email must not be empty");
  }

  // Normalize: trim and lowercase
  const normalized = email.trim().toLowerCase();

  // Length check
  if (normalized.length > 254) {
    throw new RangeError("email must not exceed 254 characters");
  }

  // Exactly one '@' check
  const atCount = (normalized.match(/@/g) || []).length;
  if (atCount !== 1) {
    throw new RangeError("email must contain exactly one '@' character");
  }

  // Split at '@'
  const atIndex = normalized.indexOf("@");
  const localPart = normalized.slice(0, atIndex);
  const domain = normalized.slice(atIndex + 1);

  // Local part validation
  if (!localPart) {
    throw new RangeError("local part must not be empty");
  }

  if (localPart.length > 64) {
    throw new RangeError("local part must not exceed 64 characters");
  }

  // Domain validation
  if (!domain) {
    throw new RangeError("domain must not be empty");
  }

  if (!domain.includes(".")) {
    throw new RangeError("domain must contain at least one dot");
  }

  // Domain must not start or end with '.' or '-'
  if (
    domain.startsWith(".") ||
    domain.endsWith(".") ||
    domain.startsWith("-") ||
    domain.endsWith("-")
  ) {
    throw new RangeError("domain must not start or end with a dot or hyphen");
  }

  // Check individual labels for leading/trailing hyphens
  const labels = domain.split(".");
  for (const label of labels) {
    if (label.startsWith("-") || label.endsWith("-")) {
      throw new RangeError("domain must not start or end with a dot or hyphen");
    }
  }

  return normalized;
}