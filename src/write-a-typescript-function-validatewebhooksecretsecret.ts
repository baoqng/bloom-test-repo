// bloom-deps:

function validateWebhookSecret(secret: unknown, minLength: unknown): string {
  if (typeof secret !== 'string' || secret.length === 0) {
    throw new TypeError('secret must be a non-empty string');
  }

  if (
    typeof minLength !== 'number' ||
    !Number.isInteger(minLength) ||
    minLength <= 0
  ) {
    throw new TypeError('minLength must be a positive integer');
  }

  if (secret.length < minLength) {
    throw new RangeError('secret must be at least minLength characters');
  }

  for (let i = 0; i < secret.length; i++) {
    const code = secret.charCodeAt(i);
    if (code < 0x20 || code > 0x7e) {
      throw new RangeError('secret must contain only printable ASCII characters');
    }
  }

  return secret;
}

export { validateWebhookSecret };