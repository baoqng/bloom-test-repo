// bloom-deps:

export function parseEmail(value: unknown): string {
  if (typeof value !== 'string') {
    throw new TypeError(`Expected a string but received ${value === null ? 'null' : typeof value}`);
  }

  if (value.length === 0) {
    throw new TypeError('Expected a non-empty string');
  }

  const trimmed = value.trim();

  if (trimmed.length === 0) {
    throw new Error('Invalid email: email cannot be empty or whitespace only');
  }

  const atIndex = trimmed.indexOf('@');
  const lastAtIndex = trimmed.lastIndexOf('@');

  if (atIndex === -1) {
    throw new Error('Invalid email: must contain exactly one "@" character');
  }

  if (atIndex !== lastAtIndex) {
    throw new Error('Invalid email: must contain exactly one "@" character');
  }

  const localPart = trimmed.substring(0, atIndex);
  const domainPart = trimmed.substring(atIndex + 1);

  if (typeof localPart !== 'string' || localPart.length === 0) {
    throw new Error('Invalid email: local part (before "@") must not be empty');
  }

  if (typeof domainPart !== 'string' || domainPart.length === 0) {
    throw new Error('Invalid email: domain part (after "@") must not be empty');
  }

  return trimmed;
}