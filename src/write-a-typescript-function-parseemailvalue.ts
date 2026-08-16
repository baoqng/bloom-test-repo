// bloom-deps:

export function parseEmail(value: unknown): string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new TypeError(`Expected a string but received ${value === null ? 'null' : typeof value}`);
  }

  const trimmed = value.trim();

  if (trimmed.length === 0) {
    throw new TypeError('Email must be a non-empty string');
  }

  // Check for null bytes
  if (trimmed.includes('\0')) {
    throw new Error(`Invalid email address: "${trimmed}" contains null bytes`);
  }

  const atIndex = trimmed.indexOf('@');
  const lastAtIndex = trimmed.lastIndexOf('@');

  if (atIndex === -1) {
    throw new Error(`Invalid email address: "${trimmed}" does not contain an "@" symbol`);
  }

  if (atIndex !== lastAtIndex) {
    throw new Error(`Invalid email address: "${trimmed}" contains more than one "@" symbol`);
  }

  const localPart = trimmed.substring(0, atIndex);
  const domainPart = trimmed.substring(atIndex + 1);

  if (typeof localPart !== 'string' || localPart.length === 0) {
    throw new Error(`Invalid email address: "${trimmed}" has an empty local part (before "@")`);
  }

  if (typeof domainPart !== 'string' || domainPart.length === 0) {
    throw new Error(`Invalid email address: "${trimmed}" has an empty domain part (after "@")`);
  }

  return trimmed;
}