// bloom-deps:

async function hashPasswordBcrypt(
  plaintext: unknown,
  saltRounds: number,
  bcrypt: { hash: (data: string, rounds: number) => Promise<string> }
): Promise<string> {
  if (typeof plaintext !== 'string' || plaintext.trim().length === 0) {
    throw new TypeError('plaintext must be a non-empty string');
  }

  if (
    !Number.isInteger(saltRounds) ||
    !Number.isFinite(saltRounds) ||
    saltRounds < 4 ||
    saltRounds > 31
  ) {
    throw new RangeError('saltRounds must be an integer between 4 and 31');
  }

  if (
    typeof bcrypt !== 'object' ||
    bcrypt === null ||
    typeof bcrypt.hash !== 'function'
  ) {
    throw new TypeError('bcrypt must be an object with a hash function');
  }

  return bcrypt.hash(plaintext, saltRounds);
}

export { hashPasswordBcrypt };