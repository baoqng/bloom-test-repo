// bloom-deps:

function camelToKebab(str: string): string {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }

  if (str.length === 0) {
    return '';
  }

  // Handle consecutive uppercase letters (acronyms) by treating them as one segment.
  // Strategy:
  // 1. Insert hyphen before a sequence of uppercase letters followed by a lowercase letter
  //    (e.g., 'XMLParser' -> 'XML-Parser' intermediate)
  // 2. Insert hyphen before a single uppercase letter preceded by a lowercase letter or digit

  let result = str
    // Handle acronym followed by capitalized word: e.g., XMLParser -> XML-Parser
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    // Handle lowercase/digit followed by uppercase: e.g., camelCase -> camel-Case
    .replace(/([a-z\d])([A-Z])/g, '$1-$2')
    .toLowerCase();

  // Remove leading hyphen if the original string started with uppercase (PascalCase)
  if (result.startsWith('-')) {
    result = result.slice(1);
  }

  return result;
}

export { camelToKebab };