// bloom-deps:

export function parseEmail(value: unknown): string {
  if (typeof value !== 'string') {
    throw new TypeError(`Expected a string, but received ${typeof value}`);
  }

  const trimmed = value.trim();

  const atIndex = trimmed.indexOf('@');
  const lastAtIndex = trimmed.lastIndexOf('@');

  if (atIndex === -1 || atIndex !== lastAtIndex) {
    throw new Error(`Invalid email address: "${trimmed}". Email must contain exactly one '@' character.`);
  }

  const localPart = trimmed.substring(0, atIndex);
  const domainPart = trimmed.substring(atIndex + 1);

  if (localPart.length === 0) {
    throw new Error(`Invalid email address: "${trimmed}". Local part (before '@') must not be empty.`);
  }

  if (domainPart.length === 0) {
    throw new Error(`Invalid email address: "${trimmed}". Domain part (after '@') must not be empty.`);
  }

  return trimmed;
}