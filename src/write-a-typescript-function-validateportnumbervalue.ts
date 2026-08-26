// bloom-deps:

function validatePortNumber(value: unknown): number {
  if (typeof value !== "string" && typeof value !== "number") {
    throw new TypeError("Port must be a string or number");
  }

  if (typeof value === "number") {
    if (!isFinite(value) || isNaN(value)) {
      throw new TypeError("Port must be finite");
    }

    if (value !== Math.trunc(value)) {
      throw new RangeError("Port must be an integer");
    }

    const intVal = Math.trunc(value);

    if (intVal < 1 || intVal > 65535) {
      throw new RangeError("Port must be between 1 and 65535");
    }

    return intVal;
  }

  // value is a string
  if (value.length === 0) {
    throw new SyntaxError("Port must be a numeric string");
  }

  if (!/^\d+$/.test(value)) {
    throw new SyntaxError("Port must be a numeric string");
  }

  const intVal = parseInt(value, 10);

  if (intVal < 1 || intVal > 65535) {
    throw new RangeError("Port must be between 1 and 65535");
  }

  return intVal;
}

export { validatePortNumber };