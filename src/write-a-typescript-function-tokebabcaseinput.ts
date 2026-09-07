// bloom-deps:

function toKebabCase(input: string): string {
  if (typeof input !== 'string') {
    throw new TypeError('Input must be a string');
  }

  let result = '';

  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    const code = char.charCodeAt(0);

    // Check if character is an uppercase letter (A-Z: 65-90)
    if (code >= 65 && code <= 90) {
      // Add hyphen before uppercase letter if result is not empty
      if (i > 0) {
        result += '-';
      }
      // Convert to lowercase and append
      result += char.toLowerCase();
    } else {
      // Append character as-is
      result += char;
    }
  }

  return result;
}

export { toKebabCase };