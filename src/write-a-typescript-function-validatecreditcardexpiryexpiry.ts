// bloom-deps:

function validateCreditCardExpiry(
  expiry: unknown,
  nowMs: unknown
): { month: number; year: number; isExpired: boolean } {
  if (typeof expiry !== "string") {
    throw new TypeError("expiry must be a string");
  }

  if (!expiry.trim()) {
    throw new RangeError("expiry must not be empty");
  }

  const trimmed = expiry.trim();

  const match = trimmed.match(/^(\d{2})\/(\d{2})$/);
  if (!match) {
    throw new RangeError("expiry must be in MM/YY format");
  }

  if (
    typeof nowMs !== "number" ||
    !Number.isFinite(nowMs) ||
    !Number.isInteger(nowMs) ||
    nowMs < 0
  ) {
    throw new TypeError("nowMs must be a non-negative integer");
  }

  const month = parseInt(match[1], 10);
  const parsedYear = parseInt(match[2], 10);
  const fullYear = 2000 + parsedYear;

  if (month < 1 || month > 12) {
    throw new RangeError("month must be between 01 and 12");
  }

  const now = new Date(nowMs);
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const isExpired =
    fullYear < currentYear ||
    (fullYear === currentYear && month < currentMonth);

  return { month, year: fullYear, isExpired };
}

export { validateCreditCardExpiry };