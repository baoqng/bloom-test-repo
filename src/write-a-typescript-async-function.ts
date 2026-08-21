// bloom-deps:

async function hashPasswordBcrypt(
  plaintext: unknown,
  saltRounds: number,
  bcrypt: { hash: (data: string, rounds: number) => Promise<string> }
): Promise<string> {
  // Validate plaintext: must be a non-empty string (after trimming for validation, but not trimmed for hashing)
  if (typeof plaintext !== "string" || plaintext.trim() === "") {
    throw new TypeError("plaintext must be a non-empty string");
  }

  // Validate saltRounds: must be an integer between 4 and 31 inclusive
  if (
    !Number.isInteger(saltRounds) ||
    !Number.isFinite(saltRounds) ||
    saltRounds < 4 ||
    saltRounds > 31
  ) {
    throw new RangeError("saltRounds must be an integer between 4 and 31");
  }

  // Validate bcrypt: must be an object with a hash function
  if (
    typeof bcrypt !== "object" ||
    bcrypt === null ||
    typeof bcrypt.hash !== "function"
  ) {
    throw new TypeError("bcrypt must be an object with a hash function");
  }

  // Delegate to bcrypt.hash with the original plaintext (not trimmed)
  return await bcrypt.hash(plaintext, saltRounds);
}

export { hashPasswordBcrypt };