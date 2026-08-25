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
        // Odd number of backslashes -> escaped separator, no split
        // Even number of backslashes -> unescaped separator, will split
        const pairedBackslashes = Math.floor(backslashCount / 2);
        // Add pairedBackslashes worth of literal backslashes (after unescape: each \\ -> \)
        // But we need to store raw content for now and unescape later
        // Actually, let's build the raw string first, then unescape
        // We'll collect the raw characters
        current += input.slice(i, j + 1); // include all backslashes and the separator char
        i = j + 1;
      } else {
        // Not followed by separator - just collect raw
        current += input.slice(i, j);
        if (nextChar !== null) {
          current += nextChar;
          i = j + 1;
        } else {
          i = j;
        }
      }
    } else if (ch === separator) {
      parts.push(current);
      current = '';
      i++;
    } else {
      current += ch;
      i++;
    }
  }

  parts.push(current);

  // Now process each part: unescape and trim
  const result: string[] = [];

  for (const part of parts) {
    const unescaped = unescape(part, separator);
    const trimmed = unescaped.trim();
    if (trimmed !== '') {
      result.push(trimmed);
    }
  }

  return result;
}

function unescape(part: string, separator: string): string {
  // We need to handle the splitting logic more carefully
  // Let's reparse: remove one level of backslash escaping
  // i.e. replace \x with x for any character x
  let result = '';
  let i = 0;

  while (i < part.length) {
    const ch = part[i];
    if (ch === '\\') {
      // Count consecutive backslashes
      let backslashCount = 0;
      let j = i;
      while (j < part.length && part[j] === '\\') {
        backslashCount++;
        j++;
      }

      // The character after backslashes
      const nextChar = j < part.length ? part[j] : null;

      // One level of unescape: pairs of \\ become \, and \x becomes x
      // Each pair of backslashes: \\ -> \
      // If odd number remains after pairs, and there's a next char, that backslash escapes nextChar
      const pairs = Math.floor(backslashCount / 2);
      const remainder = backslashCount % 2;

      // Add 'pairs' literal backslashes
      result += '\\'.repeat(pairs);

      if (remainder === 1 && nextChar !== null) {
        // The remaining backslash escapes nextChar
        result += nextChar;
        i = j + 1;
      } else {
        // No remaining backslash or no next char
        if (remainder === 1) {
          // trailing backslash with no next char
          result += '\\';
        }
        i = j;
      }
    } else {
      result += ch;
      i++;
    }
  }

  return result;
}

// Re-implement splitDelimited with a cleaner approach
// The above has a bug in how we handle backslash + separator in the main loop
// Let's rewrite completely

const _splitDelimited = splitDelimited;

export function splitDelimitedClean(input: unknown, separator: unknown): string[] {
  if (typeof input !== 'string') {
    throw new TypeError('input must be a string');
  }
  if (typeof separator !== 'string' || separator.length !== 1) {
    throw new TypeError('separator must be a single character');
  }

  if (input === '') {
    return [];
  }

  // Parse the input character by character to find split points
  // A separator is "unescaped" if preceded by an even number of backslashes (0 included)
  const splitIndices: number[] = [];
  let i = 0;

  while (i < input.length) {
    if (input[i] === '\\') {
      i += 2; // skip backslash and the escaped character
    } else if (input[i] === separator) {
      splitIndices.push(i);
      i++;
    } else {
      i++;
    }
  }

  // Split by those indices
  const rawParts: string[] = [];
  let prev = 0;
  for (const idx of splitIndices) {
    rawParts.push(input.slice(prev, idx));
    prev = idx + 1;
  }
  rawParts.push(input.slice(prev));

  // Unescape and trim each part
  const result: string[] = [];
  for (const part of rawParts) {
    const unescaped = unescapePart(part);
    const trimmed = unescaped.trim();
    if (trimmed !== '') {
      result.push(trimmed);
    }
  }

  return result;
}

function unescapePart(part: string): string {
  let result = '';
  let i = 0;
  while (i < part.length) {
    if (part[i] === '\\' && i + 1 < part.length) {
      result += part[i + 1];
      i += 2;
    } else {
      result += part[i];
      i++;
    }
  }
  return result;
}

// Override the export with the clean implementation
Object.defineProperty(exports, 'splitDelimited', {
  value: splitDelimitedClean,
  writable: true,
  configurable: true,
});