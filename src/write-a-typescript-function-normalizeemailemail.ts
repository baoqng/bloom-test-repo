// bloom-deps:

class ServiceError extends Error {
  constructor(message: string, options?: { cause?: Error }) {
    super(message);
    this.name = 'ServiceError';
    if (options?.cause) {
      this.cause = options.cause;
    }
  }
}

function normalizeEmail(email: unknown): string {
  // Validate input type
  if (typeof email !== 'string') {
    throw new TypeError('Email must be a non-empty string');
  }

  // Validate non-empty string
  if (email.length === 0) {
    throw new TypeError('Email must be a non-empty string');
  }

  // Trim leading and trailing whitespace
  const trimmedEmail = email.trim();

  // Check for exactly one '@' character
  const atCount = (trimmedEmail.match(/@/g) || []).length;
  if (atCount !== 1) {
    if (atCount === 0) {
      throw new SyntaxError('Email must contain exactly one @ character');
    } else {
      throw new SyntaxError('Email must contain exactly one @ character');
    }
  }

  // Split on '@' to get local part and domain
  const [localPart, domain] = trimmedEmail.split('@');

  // Validate local part is not empty
  if (localPart.length === 0) {
    throw new SyntaxError('Local part (before @) cannot be empty');
  }

  // Validate domain is not empty
  if (domain.length === 0) {
    throw new SyntaxError('Domain part (after @) cannot be empty');
  }

  // Validate domain contains at least one '.' character
  if (!domain.includes('.')) {
    throw new SyntaxError('Domain must contain at least one . character');
  }

  // Validate domain does not start with '.'
  if (domain.startsWith('.')) {
    throw new SyntaxError('Domain cannot start with a . character');
  }

  // Validate domain does not end with '.'
  if (domain.endsWith('.')) {
    throw new SyntaxError('Domain cannot end with a . character');
  }

  // Convert domain to lowercase
  const lowercaseDomain = domain.toLowerCase();

  // Return normalized email
  return `${localPart}@${lowercaseDomain}`;
}

export { normalizeEmail, ServiceError };