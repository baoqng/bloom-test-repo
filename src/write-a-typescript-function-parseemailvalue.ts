// bloom-deps:

function parseEmail(value: unknown): string {
  if (typeof value !== 'string' || value.length === 0 || value.trim().length === 0) {
    throw new TypeError(`Expected a string, but received ${value === null ? 'null' : typeof value}`);
  }

  const trimmed = value.trim();

  // Check for null bytes
  if (trimmed.includes('\x00')) {
    throw new Error(`Invalid email: "${trimmed}" contains null byte character`);
  }

  const atIndex = trimmed.indexOf('@');
  const lastAtIndex = trimmed.lastIndexOf('@');

  if (atIndex === -1) {
    throw new Error(`Invalid email: "${trimmed}" does not contain an '@' character`);
  }

  if (atIndex !== lastAtIndex) {
    throw new Error(`Invalid email: "${trimmed}" contains more than one '@' character`);
  }

  const localPart = trimmed.slice(0, atIndex);
  const domainPart = trimmed.slice(atIndex + 1);

  if (localPart.length === 0) {
    throw new Error(`Invalid email: "${trimmed}" has an empty local part (before '@')`);
  }

  if (domainPart.length === 0) {
    throw new Error(`Invalid email: "${trimmed}" has an empty domain part (after '@')`);
  }

  return trimmed;
}

export { parseEmail };