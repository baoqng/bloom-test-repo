// bloom-deps:

function validateArrayOf<T>(arr: unknown, elementType: unknown, minLength: unknown, maxLength: unknown): T[] {
  if (!Array.isArray(arr)) {
    throw new TypeError("arr must be an array");
  }

  if (typeof elementType !== "string") {
    throw new TypeError("elementType must be a string");
  }

  const normalizedElementType = elementType.trim().toLowerCase();
  if (normalizedElementType !== "string" && normalizedElementType !== "number" && normalizedElementType !== "boolean") {
    throw new RangeError("elementType must be 'string', 'number', or 'boolean'");
  }

  if (
    typeof minLength !== "number" ||
    !Number.isFinite(minLength) ||
    !Number.isInteger(minLength) ||
    minLength < 0
  ) {
    throw new TypeError("minLength must be a non-negative integer");
  }

  if (
    typeof maxLength !== "number" ||
    !Number.isFinite(maxLength) ||
    !Number.isInteger(maxLength) ||
    maxLength <= 0
  ) {
    throw new TypeError("maxLength must be a positive integer");
  }

  if (maxLength < minLength) {
    throw new RangeError("maxLength must be >= minLength");
  }

  if (arr.length < minLength || arr.length > maxLength) {
    throw new RangeError(`array length must be between ${minLength} and ${maxLength}`);
  }

  for (let i = 0; i < arr.length; i++) {
    if (typeof arr[i] !== normalizedElementType) {
      throw new TypeError(`element at index ${i} must be a ${normalizedElementType}`);
    }
  }

  return arr as T[];
}

export { validateArrayOf };