// bloom-deps:

export function parseKeyPathSegments(value: unknown): Array<string | number> {
  // Type check
  if (typeof value !== 'string') {
    throw new TypeError('Expected a string');
  }

  const path = value;

  // Empty string check
  if (path.length === 0) {
    throw new SyntaxError('Key path must not be empty');
  }

  // Leading dot check
  if (path[0] === '.') {
    throw new SyntaxError("Path must not start or end with '.'");
  }

  // Trailing dot check
  if (path[path.length - 1] === '.') {
    throw new SyntaxError("Path must not start or end with '.'");
  }

  const segments: Array<string | number> = [];
  let currentSegment = '';
  let i = 0;

  while (i < path.length) {
    const char = path[i];

    if (char === '[') {
      // Flush current dot segment if any
      if (currentSegment.length > 0) {
        // Validate dot segment
        if (!/^[a-zA-Z0-9_]+$/.test(currentSegment)) {
          throw new SyntaxError(`Invalid segment: '${currentSegment}'`);
        }
        segments.push(currentSegment);
        currentSegment = '';
      }

      // Parse bracket segment
      i++; // Skip '['
      let bracketContent = '';
      let foundClosing = false;

      while (i < path.length) {
        if (path[i] === ']') {
          foundClosing = true;
          i++;
          break;
        }
        bracketContent += path[i];
        i++;
      }

      if (!foundClosing) {
        throw new SyntaxError(`Invalid array index: '${bracketContent}'`);
      }

      // Validate bracket content is all digits
      if (bracketContent.length === 0 || !/^\d+$/.test(bracketContent)) {
        throw new SyntaxError(`Invalid array index: '${bracketContent}'`);
      }

      segments.push(parseInt(bracketContent, 10));
    } else if (char === '.') {
      // Flush current dot segment
      if (currentSegment.length > 0) {
        // Validate dot segment
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
    // Validate dot segment
    if (!/^[a-zA-Z0-9_]+$/.test(currentSegment)) {
      throw new SyntaxError(`Invalid segment: '${currentSegment}'`);
    }
    segments.push(currentSegment);
  }

  return segments;
}