// bloom-deps:

export function parseEmail(value: unknown): string {
  if (typeof value !== 'string') {
    throw new TypeError(`Expected a string, but received ${typeof value}`);
  }

  const trimmed = value.trim();

  const atCount = (trimmed.match(/@/g) || []).length;
  if (atCount !== 1) {
    throw new Error(`Invalid email address: "${trimmed}" must contain exactly one '@' character`);
  }

  const atIndex = trimmed.indexOf('@');
  const localPart = trimmed.slice(0, atIndex);
  const domainPart = trimmed.slice(atIndex + 1);

  if (localPart.length === 0) {
    throw new Error(`Invalid email address: "${trimmed}" has an empty local part before '@'`);
  }

  if (domainPart.length === 0) {
    throw new Error(`Invalid email address: "${trimmed}" has an empty domain part after '@'`);
  }

  return trimmed;
}