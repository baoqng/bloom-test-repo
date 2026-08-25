// bloom-deps:

export function splitDelimited(input: unknown, separator: unknown): string[] {
  if (typeof input !== 'string') {
    throw new TypeError('input must be a string');
  }
  if (typeof separator !== 'string' || separator.length !== 1) {
    throw new TypeError('separator must be a single character');
  }

  if (input === '') {
    return [];
  }

  const parts: string[] = [];
  let current = '';
  let i = 0;

  while (i < input.length) {
    const ch = input[i];

    if (ch === '\\') {
      // Count consecutive backslashes
      let backslashCount = 0;
      let j = i;
      while (j < input.length && input[j] === '\\') {
        backslashCount++;
        j++;
      }

      // The character after the backslashes
      const nextChar = j < input.length ? input[j] : null;

      if (nextChar === separator) {
        // Odd number of backslashes means the separator is escaped
        // Even number means the separator is unescaped
        const escapedPairs = Math.floor(backslashCount / 2);
        const isEscaped = backslashCount % 2 === 1;

        // Add escapedPairs backslashes (each pair reduces to one)
        current += '\\'.repeat(escapedPairs);

        if (isEscaped) {
          // The separator is escaped, add it as literal character
          current += separator;
          i = j + 1;
        } else {
          // The separator is unescaped, split here
          parts.push(current);
          current = '';
          i = j + 1;
        }
      } else {
        // Backslashes not followed by separator
        // Each pair of backslashes reduces to one backslash
        // If odd number, the last backslash escapes nextChar
        const escapedPairs = Math.floor(backslashCount / 2);
        const hasOdd = backslashCount % 2 === 1;

        current += '\\'.repeat(escapedPairs);

        if (hasOdd && nextChar !== null) {
          // The odd backslash escapes nextChar
          current += nextChar;
          i = j + 1;
        } else {
          // Even number of backslashes, nextChar is not consumed
          i = j;
        }
      }
    } else if (ch === separator) {
      // Unescaped separator
      parts.push(current);
      current = '';
      i++;
    } else {
      current += ch;
      i++;
    }
  }

  // Push the last part
  parts.push(current);

  // Trim whitespace and filter empty parts
  return parts
    .map(p => p.trim())
    .filter(p => p.length > 0);
}