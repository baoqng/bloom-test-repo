// bloom-deps:

export function validateUserEmail(email: unknown): string {
  if (typeof email !== "string") {
    throw new TypeError("email must be a string");
  }

  if (!email.trim()) {
    throw new RangeError("email must not be empty");
  }

  const normalised = email.trim().toLowerCase();

  if (normalised.length > 254) {
    throw new RangeError("email must not exceed 254 characters");
  }

  const atCount = normalised.split("@").length - 1;
  if (atCount !== 1) {
    throw new RangeError("email must contain exactly one '@' character");
  }

  const atIndex = normalised.indexOf("@");
  const local = normalised.slice(0, atIndex);
  const domain = normalised.slice(atIndex + 1);

  if (local.length === 0) {
    throw new RangeError("local part must not be empty");
  }

  if (local.length > 64) {
    throw new RangeError("local part must not exceed 64 characters");
  }

  if (domain.length === 0) {
    throw new RangeError("domain must not be empty");
  }

  if (!domain.includes(".")) {
    throw new RangeError("domain must contain at least one dot");
  }

  if (
    domain.startsWith(".") ||
    domain.endsWith(".") ||
    domain.startsWith("-") ||
    domain.endsWith("-")
  ) {
    throw new RangeError("domain must not start or end with a dot or hyphen");
  }

  const labels = domain.split(".");
  for (const label of labels) {
    if (label.startsWith("-") || label.endsWith("-")) {
      throw new RangeError("domain must not start or end with a dot or hyphen");
    }
  }

  return normalised;
}