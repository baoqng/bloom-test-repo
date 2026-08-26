// bloom-deps:

export function parseKeyPathSegments(value: unknown): Array<string | number> {
  if (typeof value !== 'string') {
    throw new TypeError('Expected a string');
  }

  if (value.length === 0) {
    throw new SyntaxError('Key path must not be empty');
  }

  if (value.startsWith('.') || value.endsWith('.')) {
    throw new SyntaxError("Path must not start or end with '.'");
  }

  const segments: Array<string | number> = [];

  // Parse the path character by character
  let i = 0;
  let currentSegment = '';

  while (i < value.length) {
    const char = value[i];

    if (char === '[') {
      // Flush current dot segment if any
      if (currentSegment.length > 0) {
        if (!/^[a-zA-Z0-9_]+$/.test(currentSegment)) {
          throw new SyntaxError(`Invalid segment: '${currentSegment}'`);
        }
        segments.push(currentSegment);
        currentSegment = '';
      }

      // Find closing bracket
      const closeIdx = value.indexOf(']', i);
      if (closeIdx === -1) {
        throw new SyntaxError("Invalid bracket notation: missing ']'");
      }

      const inner = value.slice(i + 1, closeIdx);

      // Validate bracket content: must be a sequence of digits (non-empty)
      if (!/^\d+$/.test(inner)) {
        throw new SyntaxError(`Invalid array index: '${inner}'`);
      }

      segments.push(parseInt(inner, 10));
      i = closeIdx + 1;

    } else if (char === '.') {
      // Flush current dot segment
      if (currentSegment.length > 0) {
        if (!/^[a-zA-Z0-9_]+$/.test(currentSegment)) {
          throw new SyntaxError(`Invalid segment: '${currentSegment}'`);
        }
        segments.push(currentSegment);
        currentSegment = '';
      }
      i++;
    } else {
      currentSegment += char;
      i++;
    }
  }

  // Flush remaining segment
  if (currentSegment.length > 0) {
    if (!/^[a-zA-Z0-9_]+$/.test(currentSegment)) {
      throw new SyntaxError(`Invalid segment: '${currentSegment}'`);
    }
    segments.push(currentSegment);
  }

  return segments;
}