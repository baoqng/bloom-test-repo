// bloom-deps:

export function parseEmail(value: unknown): string {
  if (typeof value !== 'string') {
    throw new TypeError(`Expected a string but received ${value === null ? 'null' : typeof value}`);
  }

  const trimmed = value.trim();

  const atIndex = trimmed.indexOf('@');
  const lastAtIndex = trimmed.lastIndexOf('@');

  if (atIndex === -1) {
    throw new Error(`Invalid email: missing '@' character in "${trimmed}"`);
  }

  if (atIndex !== lastAtIndex) {
    throw new Error(`Invalid email: contains more than one '@' character in "${trimmed}"`);
  }

  const localPart = trimmed.substring(0, atIndex);
  const domainPart = trimmed.substring(atIndex + 1);

  if (localPart.length === 0) {
    throw new Error(`Invalid email: local part (before '@') must not be empty in "${trimmed}"`);
  }

  if (domainPart.length === 0) {
    throw new Error(`Invalid email: domain part (after '@') must not be empty in "${trimmed}"`);
  }

  return trimmed;
}