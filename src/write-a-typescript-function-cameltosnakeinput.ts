// bloom-deps:

function camelToSnake(input: unknown): string {
  if (typeof input !== 'string') {
    throw new TypeError(`Expected a string but received ${typeof input}`);
  }

  if (input.length === 0) {
    return '';
  }

  // Insert underscore before sequences of uppercase letters followed by lowercase,
  // and before single uppercase letters preceded by lowercase letters or digits.
  // This handles both camelCase and PascalCase including acronyms like XMLParser -> xml_parser
  const result = input
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
    .toLowerCase();

  return result;
}

export { camelToSnake };