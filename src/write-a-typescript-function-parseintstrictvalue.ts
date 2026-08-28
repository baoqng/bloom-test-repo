// bloom-deps:

export function parseIntStrict(value: unknown, min?: number, max?: number): number {
  if (typeof value !== "string") {
    throw new TypeError("value must be a string");
  }

  if (!/^-?[0-9]+$/.test(value)) {
    throw new RangeError("string does not match required integer format");
  }

  // Reject leading zeros (except '0' itself and '-0' should also be rejected as it implies leading zero after sign)
  // The pattern ^-?[0-9]+$ allows '-0' and '01' etc, so we need extra checks
  // Leading zeros: after optional '-', if first digit is '0' and there are more digits
  const digits = value.startsWith("-") ? value.slice(1) : value;
  if (digits.length > 1 && digits.startsWith("0")) {
    throw new RangeError("string must not have leading zeros");
  }

  const parsed = Number(value);

  if (!isFinite(parsed)) {
    throw new RangeError("parsed integer is not finite");
  }

  if (min !== undefined && parsed < min) {
    throw new RangeError(`value ${parsed} is less than minimum ${min}`);
  }

  if (max !== undefined && parsed > max) {
    throw new RangeError(`value ${parsed} is greater than maximum ${max}`);
  }

  return parsed;
}