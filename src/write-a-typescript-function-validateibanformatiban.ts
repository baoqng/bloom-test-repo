// bloom-deps:

export function validateIbanFormat(iban: unknown): string {
  if (typeof iban !== "string") {
    throw new TypeError("iban must be a string");
  }

  if (iban.trim().length === 0) {
    throw new RangeError("iban must not be empty");
  }

  // Normalise: trim, remove all space characters, uppercase
  const normalised = iban.trim().replace(/ /g, "").toUpperCase();

  // Check length
  if (normalised.length < 15 || normalised.length > 34) {
    throw new RangeError("iban must be between 15 and 34 characters");
  }

  // Check first 2 characters are uppercase ASCII letters
  if (!/^[A-Z]{2}/.test(normalised)) {
    throw new RangeError("iban must start with a 2-letter country code");
  }

  // Check characters at index 2 and 3 are decimal digits
  if (!/^[A-Z]{2}[0-9]{2}/.test(normalised)) {
    throw new RangeError("iban check digits must be 2 decimal digits");
  }

  // Check remaining characters are only uppercase letters and digits
  const remainder = normalised.slice(4);
  if (!/^[A-Z0-9]*$/.test(remainder)) {
    throw new RangeError("iban must contain only uppercase letters and digits");
  }

  return normalised;
}