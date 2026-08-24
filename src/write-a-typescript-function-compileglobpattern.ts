// bloom-deps:

function compileGlob(pattern: string): RegExp {
  if (typeof pattern !== 'string') {
    throw new TypeError('pattern must be a string');
  }
  if (pattern.length === 0) {
    throw new SyntaxError('pattern must not be empty');
  }

  let regexStr = '^';
  let i = 0;

  while (i < pattern.length) {
    // Check for **
    if (pattern[i] === '*' && pattern[i + 1] === '*') {
      regexStr += '.*';
      i += 2;
    } else if (pattern[i] === '*') {
      regexStr += '[^/]*';
      i += 1;
    } else if (pattern[i] === '?') {
      regexStr += '[^/]';
      i += 1;
    } else {
      // Escape regex special characters
      regexStr += pattern[i].replace(/[.+^${}()|[\]\\]/g, '\\$&');
      i += 1;
    }
  }

  regexStr += '$';

  return new RegExp(regexStr);
}

export { compileGlob };