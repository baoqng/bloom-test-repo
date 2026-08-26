// bloom-deps:

export function validateBicCode(bic: unknown): string {
  if (typeof bic !== "string") {
    throw new TypeError("bic must be a string");
  }

  if (bic.trim().length === 0) {
    throw new RangeError("bic must not be empty");
  }

  const normalized = bic.trim().toUpperCase();

  if (normalized.length !== 8 && normalized.length !== 11) {
    throw new RangeError("bic must be 8 or 11 characters");
  }

  const bankCode = normalized.slice(0, 4);
  if (!/^[A-Z]{4}$/.test(bankCode)) {
    throw new RangeError("bank code must be 4 uppercase letters");
  }

  const countryCode = normalized.slice(4, 6);
  if (!/^[A-Z]{2}$/.test(countryCode)) {
    throw new RangeError("country code must be 2 uppercase letters");
  }

  const locationCode = normalized.slice(6, 8);
  if (!/^[A-Z0-9]{2}$/.test(locationCode)) {
    throw new RangeError("location code must be 2 alphanumeric characters");
  }

  if (normalized.length === 11) {
    const branchCode = normalized.slice(8, 11);
    if (!/^[A-Z0-9]{3}$/.test(branchCode)) {
      throw new RangeError("branch code must be 3 alphanumeric characters");
    }
  }

  return normalized;
}