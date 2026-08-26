function validateEmailAddress(email: unknown): string {
  if (typeof email !== "string") {
    throw new TypeError("email must be a string");
  }

  if (email.trim().length === 0) {
    throw new RangeError(email.length === 0 ? "email must not be empty" : "email must not be empty");
  }

  const trimmed = email.trim();

  const atCount = (trimmed.match(/@/g) || []).length;
  if (atCount !== 1) {
    throw new RangeError("email must contain exactly one '@' character");
  }

  const atIndex = trimmed.indexOf("@");
  const localPart = trimmed.substring(0, atIndex);
  const domain = trimmed.substring(atIndex + 1);

  if (localPart.length === 0) {
    throw new RangeError("local part must not be empty");
  }

  if (domain.length === 0) {
    throw new RangeError("domain must not be empty");
  }

  if (!domain.includes(".")) {
    throw new RangeError("domain must contain at least one dot");
  }

  // Check domain boundaries
  if (
    domain.startsWith(".") ||
    domain.endsWith(".") ||
    domain.startsWith("-") ||
    domain.endsWith("-")
  ) {
    throw new RangeError("domain must not start or end with a dot or hyphen");
  }

  // Check each domain label for starting/ending with dot or hyphen
  const labels = domain.split(".");
  for (const label of labels) {
    if (label.startsWith("-") || label.endsWith("-")) {
      throw new RangeError("domain must not start or end with a dot or hyphen");
    }
  }

  if (trimmed.length > 254) {
    throw new RangeError("email must not exceed 254 characters");
  }

  return trimmed.toLowerCase();
}

export { validateEmailAddress };