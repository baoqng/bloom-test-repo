// bloom-deps:

function validatePhoneE164(phone: unknown): string {
  if (typeof phone !== "string") {
    throw new TypeError("phone must be a string");
  }

  if (phone.trim().length === 0) {
    throw new RangeError("phone must not be empty");
  }

  const trimmed = phone.trim();

  if (!trimmed.startsWith("+")) {
    throw new RangeError("phone must start with '+'");
  }

  const afterPlus = trimmed.slice(1);

  if (!/^\d+$/.test(afterPlus)) {
    throw new RangeError("phone must contain only digits after '+'");
  }

  if (afterPlus.length < 7 || afterPlus.length > 15) {
    throw new RangeError("phone must have between 7 and 15 digits after '+'");
  }

  return trimmed;
}

export { validatePhoneE164 };