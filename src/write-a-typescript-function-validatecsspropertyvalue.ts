// bloom-deps:

function validateCssProperty(value: unknown): string {
  if (typeof value !== "string") {
    throw new TypeError("Expected a string");
  }

  if (!value.startsWith("--")) {
    throw new SyntaxError("CSS custom property must start with '--'");
  }

  const afterPrefix = value.slice(2);

  if (afterPrefix.length === 0) {
    throw new SyntaxError("Property name after '--' must not be empty");
  }

  if (/[^A-Za-z0-9_-]/.test(afterPrefix)) {
    throw new SyntaxError("Property name contains invalid characters");
  }

  const firstChar = afterPrefix[0];
  if (/[0-9-]/.test(firstChar)) {
    throw new SyntaxError("Property name must not start with a digit or hyphen after '--'");
  }

  return value;
}

export { validateCssProperty };