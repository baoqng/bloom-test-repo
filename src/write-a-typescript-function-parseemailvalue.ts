// bloom-deps:

function parseEmail(value: unknown): string {
  if (typeof value !== 'string') {
    throw new TypeError(`Expected a string, but received ${value === null ? 'null' : typeof value}`);
  }

  const trimmed = value.trim();

  const [local, ...rest] = trimmed.split('@');

  if (rest.length !== 1 || !local) {
    throw new Error(`Invalid email format: "${trimmed}". Email must contain exactly one '@' with non-empty local and domain parts.`);
  }

  const domain = rest[0];
  const parts = domain.split('.');

  if (parts.length < 2 || !parts.every(p => p.length > 0)) {
    throw new Error(`Invalid email format: "${trimmed}". Domain part must contain at least one '.' with non-empty labels.`);
  }

  return trimmed;
}

export { parseEmail };