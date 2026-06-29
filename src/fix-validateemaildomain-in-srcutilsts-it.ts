// bloom-deps:

export function validateEmailDomain(email: unknown): string {
  if (email === null || email === undefined) {
    throw new TypeError('email is required');
  }

  if (typeof email !== 'string') {
    throw new TypeError('email must be a string');
  }

  const parts = email.split('@');

  if (parts.length !== 2) {
    throw new TypeError('email must contain exactly one @ symbol');
  }

  if (parts[0].trim() === '') {
    throw new TypeError('email local part cannot be empty');
  }

  if (!parts[1].includes('.')) {
    throw new TypeError('email domain must contain at least one period');
  }

  return parts[0].trim().toLowerCase() + '@' + parts[1].trim().toLowerCase();
}