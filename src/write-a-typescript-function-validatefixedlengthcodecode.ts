// bloom-deps:

function validateFixedLengthCode(code: unknown, type: unknown): string {
  if (typeof code !== "string") {
    throw new TypeError("code must be a string");
  }
  if (typeof type !== "string") {
    throw new TypeError("type must be a string");
  }

  const normalizedType = type.trim().toLowerCase();
  if (
    normalizedType !== "numeric" &&
    normalizedType !== "alpha" &&
    normalizedType !== "alphanumeric"
  ) {
    throw new RangeError("type must be 'numeric', 'alpha', or 'alphanumeric'");
  }

  const trimmedCode = code.trim();
  if (trimmedCode.length === 0) {
    throw new RangeError("code must not be empty");
  }

  if (normalizedType === "numeric") {
    if (!/^[0-9]+$/.test(trimmedCode)) {
      throw new RangeError("code must contain only digits");
    }
    if (trimmedCode.length < 4 || trimmedCode.length > 12) {
      throw new RangeError("numeric code must be between 4 and 12 characters");
    }
  } else if (normalizedType === "alpha") {
    if (!/^[a-zA-Z]+$/.test(trimmedCode)) {
      throw new RangeError("code must contain only letters");
    }
    if (trimmedCode.length < 2 || trimmedCode.length > 8) {
      throw new RangeError("alpha code must be between 2 and 8 characters");
    }
  } else if (normalizedType === "alphanumeric") {
    if (!/^[a-zA-Z0-9]+$/.test(trimmedCode)) {
      throw new RangeError("code must contain only letters and digits");
    }
    if (trimmedCode.length < 6 || trimmedCode.length > 20) {
      throw new RangeError(
        "alphanumeric code must be between 6 and 20 characters"
      );
    }
  }

  return trimmedCode;
}

export { validateFixedLengthCode };