// bloom-deps:

const RESERVED_WORDS = new Set([
  "break", "case", "catch", "class", "const", "continue", "debugger",
  "default", "delete", "do", "else", "export", "extends", "finally",
  "for", "function", "if", "import", "in", "instanceof", "let", "new",
  "return", "static", "super", "switch", "this", "throw", "try", "typeof",
  "var", "void", "while", "with", "yield"
]);

export function validateProgramIdentifier(value: unknown): string {
  if (typeof value !== "string") {
    throw new TypeError("Expected a string");
  }

  if (value.length === 0) {
    throw new SyntaxError("Identifier must not be empty");
  }

  if (value.length > 255) {
    throw new RangeError("Identifier must not exceed 255 characters");
  }

  if (!/^[A-Za-z_]/.test(value)) {
    throw new SyntaxError("Identifier must start with a letter or underscore");
  }

  if (!/^[A-Za-z0-9_]+$/.test(value)) {
    throw new SyntaxError("Identifier contains invalid characters");
  }

  if (RESERVED_WORDS.has(value)) {
    throw new SyntaxError("Identifier must not be a reserved word");
  }

  return value;
}