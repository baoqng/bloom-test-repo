// bloom-deps:

export function parseLogLine(line: unknown): { timestamp: string; level: string; message: string; fields: Record<string, string> } {
  if (typeof line !== 'string' || line.length === 0) {
    throw new TypeError('line must be a non-empty string');
  }

  if (line[0] !== '[') {
    throw new SyntaxError('Not a valid log line');
  }

  const closingBracketIndex = line.indexOf(']');
  if (closingBracketIndex === -1) {
    throw new SyntaxError('Missing closing bracket in timestamp');
  }

  const timestamp = line.slice(1, closingBracketIndex);

  const afterBracket = line.slice(closingBracketIndex + 1).trimStart();

  const spaceAfterLevel = afterBracket.indexOf(' ');
  let level: string;
  let rest: string;

  if (spaceAfterLevel === -1) {
    level = afterBracket;
    rest = '';
  } else {
    level = afterBracket.slice(0, spaceAfterLevel);
    rest = afterBracket.slice(spaceAfterLevel + 1);
  }

  const tokens = rest.split(/\s+/).filter(t => t.length > 0);

  const keyValuePattern = /^[A-Za-z0-9_]+=\S+$/;
  const fields: Record<string, string> = {};
  const messageParts: string[] = [];
  let foundFirstKeyValue = false;

  for (const token of tokens) {
    if (!foundFirstKeyValue && keyValuePattern.test(token)) {
      foundFirstKeyValue = true;
    }

    if (foundFirstKeyValue && keyValuePattern.test(token)) {
      const eqIndex = token.indexOf('=');
      const key = token.slice(0, eqIndex);
      const value = token.slice(eqIndex + 1);
      fields[key] = value;
    } else if (!foundFirstKeyValue) {
      messageParts.push(token);
    }
  }

  const message = messageParts.join(' ').trim();

  return { timestamp, level, message, fields };
}