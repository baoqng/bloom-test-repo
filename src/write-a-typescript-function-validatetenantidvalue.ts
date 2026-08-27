// bloom-deps:

function validateTenantId(value: unknown): void {
  if (typeof value !== 'string') {
    throw new TypeError('value must be a string');
  }

  const trimmed = value.trim();

  if (trimmed.length < 8) {
    throw new RangeError('id too short');
  }

  if (!/^[A-Za-z0-9]+-[A-Za-z0-9]+$/.test(trimmed)) {
    throw new SyntaxError('invalid format');
  }
}

export { validateTenantId };