// bloom-deps:

function validateEmailDomain(email: unknown, allowedDomains: unknown): boolean {
  // Type check email
  if (typeof email !== "string" || email.length === 0) {
    throw new TypeError("email must be a non-empty string");
  }

  // Type check allowedDomains
  if (!Array.isArray(allowedDomains) || allowedDomains.length === 0) {
    throw new TypeError("allowedDomains must be a non-empty array of strings");
  }

  for (const item of allowedDomains) {
    if (typeof item !== "string") {
      throw new TypeError("allowedDomains must be a non-empty array of strings");
    }
  }

  // Count '@' characters exactly
  const atCount = (email.match(/@/g) || []).length;
  if (atCount !== 1) {
    throw new RangeError("email must contain exactly one '@' character");
  }

  // Extract domain using indexOf + slice
  const atIndex = email.indexOf("@");
  const domain = email.slice(atIndex + 1);

  if (domain.length === 0) {
    throw new RangeError("domain part of email must not be empty");
  }

  // Case-insensitive domain comparison
  const normalizedDomain = domain.toLowerCase();
  for (const allowed of allowedDomains as string[]) {
    if (allowed.toLowerCase() === normalizedDomain) {
      return true;
    }
  }

  return false;
}

export { validateEmailDomain };