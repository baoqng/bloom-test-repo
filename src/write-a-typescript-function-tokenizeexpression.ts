// bloom-deps:

type Token = {
  type: 'number' | 'operator' | 'paren' | 'identifier';
  value: string;
};

export function tokenize(expression: string): Token[] {
  if (typeof expression !== 'string') {
    throw new TypeError('Expected string input');
  }

  const tokens: Token[] = [];
  let i = 0;

  while (i < expression.length) {
    const ch = expression[i];

    // Skip whitespace
    if (/\s/.test(ch)) {
      i++;
      continue;
    }

    // Number: integer or decimal
    if (/[0-9]/.test(ch) || (ch === '.' && i + 1 < expression.length && /[0-9]/.test(expression[i + 1]))) {
      let num = '';
      while (i < expression.length && /[0-9]/.test(expression[i])) {
        num += expression[i];
        i++;
      }
      if (i < expression.length && expression[i] === '.') {
        num += '.';
        i++;
        while (i < expression.length && /[0-9]/.test(expression[i])) {
          num += expression[i];
          i++;
        }
      }
      tokens.push({ type: 'number', value: num });
      continue;
    }

    // Operator
    if (['+', '-', '*', '/', '%', '^'].includes(ch)) {
      tokens.push({ type: 'operator', value: ch });
      i++;
      continue;
    }

    // Paren
    if (ch === '(' || ch === ')') {
      tokens.push({ type: 'paren', value: ch });
      i++;
      continue;
    }

    // Identifier: alphabetic
    if (/[a-zA-Z]/.test(ch)) {
      let ident = '';
      while (i < expression.length && /[a-zA-Z]/.test(expression[i])) {
        ident += expression[i];
        i++;
      }
      tokens.push({ type: 'identifier', value: ident });
      continue;
    }

    // Unrecognized character
    throw new SyntaxError(`Unrecognized character: '${ch}'`);
  }

  return tokens;
}