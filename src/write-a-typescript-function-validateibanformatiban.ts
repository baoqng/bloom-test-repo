// bloom-deps:

export function validateIbanFormat(iban: unknown): string {
  if (typeof iban !== "string") {
    throw new TypeError("iban must be a string");
  }

  if (!iban.trim()) {
    throw new RangeError("iban must not be empty");
  }

  // Normalise: trim, remove all spaces, uppercase
  const normalised = iban.trim().replace(/ /g, "").toUpperCase();

  // Validate length
  if (normalised.length < 15 || normalised.length > 34) {
    throw new RangeError("iban must be between 15 and 34 characters");
  }

  // Validate country code (first 2 chars must be A-Z)
  if (!/^[A-Z]{2}/.test(normalised)) {
    throw new RangeError("iban must start with a 2-letter country code");
  }

  // Validate check digits (chars at index 2 and 3 must be decimal digits)
  if (!/^\d{2}$/.test(normalised.slice(2, 4))) {
    throw new RangeError("iban check digits must be 2 decimal digits");
  }

  // Validate remaining characters (after first 4) must be A-Z or 0-9
  const rest = normalised.slice(4);
  if (!/^[A-Z0-9]+$/.test(rest)) {
    throw new RangeError("iban must contain only uppercase letters and digits");
  }

  return normalised;
}