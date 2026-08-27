// bloom-deps:

function validateServiceToken(value: unknown): void {
  if (typeof value !== 'string') {
    throw new TypeError('value must be a string');
  }

  const normalised = value.trim();

  if (normalised.length < 20) {
    throw new RangeError('token too short');
  }

  if (normalised.length > 128) {
    throw new RangeError('token too long');
  }

  if (!normalised.startsWith('svc_')) {
    throw new SyntaxError('invalid prefix');
  }

  const afterPrefix = normalised.slice(4);

  if (/[^a-z0-9_]/.test(afterPrefix)) {
    throw new SyntaxError('invalid characters');
  }
}

export { validateServiceToken };