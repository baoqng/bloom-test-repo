// bloom-deps:

function validateEmailDomain(email: unknown, allowedDomains: unknown): boolean {
  // Type check for email
  if (typeof email !== "string" || email.length === 0) {
    throw new TypeError("email must be a non-empty string");
  }

  // Type check for allowedDomains
  if (!Array.isArray(allowedDomains) || allowedDomains.length === 0) {
    throw new TypeError("allowedDomains must be a non-empty array of strings");
  }

  // Check that all elements in allowedDomains are strings
  for (const domain of allowedDomains) {
    if (typeof domain !== "string") {
      throw new TypeError("allowedDomains must be a non-empty array of strings");
    }
  }

  // Count '@' characters exactly
  const atCount = (email.match(/@/g) || []).length;
  if (atCount !== 1) {
    throw new RangeError("email must contain exactly one '@' character");
  }

  // Extract domain part
  const atIndex = email.indexOf("@");
  const domainPart = email.slice(atIndex + 1);

  // Check for empty domain
  if (domainPart.length === 0) {
    throw new RangeError("domain part after '@' must not be empty");
  }

  // Case-insensitive domain comparison
  const normalizedDomain = domainPart.toLowerCase();
  for (const allowed of allowedDomains as string[]) {
    if (allowed.toLowerCase() === normalizedDomain) {
      return true;
    }
  }

  return false;
}

export { validateEmailDomain };