// bloom-deps:

export class ServiceError extends Error {
  constructor(
    message: string,
    public context?: { cause?: unknown }
  ) {
    super(message);
    this.name = 'ServiceError';
  }
}

export function validateEmailDomain(
  email: unknown,
  allowedDomains: unknown
): boolean {
  // Validate email type and content
  if (typeof email !== 'string') {
    throw new TypeError('email must be a non-empty string');
  }

  if (email.length === 0) {
    throw new TypeError('email must be a non-empty string');
  }

  // Validate allowedDomains type
  if (!Array.isArray(allowedDomains)) {
    throw new TypeError('allowedDomains must be a non-empty array of strings');
  }

  if (allowedDomains.length === 0) {
    throw new TypeError('allowedDomains must be a non-empty array of strings');
  }

  // Validate all elements in allowedDomains are strings
  for (const domain of allowedDomains) {
    if (typeof domain !== 'string') {
      throw new TypeError('allowedDomains must be a non-empty array of strings');
    }
  }

  // Count '@' characters
  const atSignCount = (email.match(/@/g) || []).length;

  if (atSignCount === 0) {
    throw new RangeError('email must contain exactly one \'@\' character');
  }

  if (atSignCount > 1) {
    throw new RangeError('email must contain exactly one \'@\' character');
  }

  // Extract domain part (after '@')
  const atIndex = email.indexOf('@');
  const domain = email.substring(atIndex + 1);

  if (domain.length === 0) {
    throw new RangeError('email domain part cannot be empty');
  }

  // Case-insensitive domain comparison
  const emailDomainLower = domain.toLowerCase();
  const allowedDomainsLower = allowedDomains.map((d) => d.toLowerCase());

  return allowedDomainsLower.includes(emailDomainLower);
}