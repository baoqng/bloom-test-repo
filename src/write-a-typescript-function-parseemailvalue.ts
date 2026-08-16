// bloom-deps:

export function parseEmail(value: unknown): string {
  if (typeof value !== 'string') {
    throw new TypeError(
      `Expected a string but received ${value === null ? 'null' : typeof value}`
    );
  }

  const trimmed = value.trim();

  const atIndex = trimmed.indexOf('@');
  const lastAtIndex = trimmed.lastIndexOf('@');

  if (atIndex === -1) {
    throw new Error(`Invalid email address: "${trimmed}" does not contain an "@" symbol`);
  }

  if (atIndex !== lastAtIndex) {
    throw new Error(`Invalid email address: "${trimmed}" contains more than one "@" symbol`);
  }

  const localPart = trimmed.slice(0, atIndex);
  const domainPart = trimmed.slice(atIndex + 1);

  if (localPart.length === 0) {
    throw new Error(`Invalid email address: "${trimmed}" has an empty local part before "@"`);
  }

  if (domainPart.length === 0) {
    throw new Error(`Invalid email address: "${trimmed}" has an empty domain part after "@"`);
  }

  return trimmed;
}